import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtUserPayload } from '../types';
import { ReminderFrequencyDto, UpdateReminderConfigDto } from './dto/update-reminder-config.dto';
import { MailService } from './mail.service';

const ONE_MINUTE = 60_000;

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
	private scheduler?: NodeJS.Timeout;

	constructor(
		private readonly prisma: PrismaService,
		private readonly mailService: MailService,
	) {}

	onModuleInit() {
		void this.processDueReminders();
		this.scheduler = setInterval(() => void this.processDueReminders(), ONE_MINUTE);
	}

	onModuleDestroy() {
		if (this.scheduler) clearInterval(this.scheduler);
	}

	async getReminderConfig(authenticatedUser: JwtUserPayload) {
		const config = await this.prisma.reminderConfig.findUnique({
			where: { userId: authenticatedUser.id },
		});

		return (
			config ?? {
				active: false,
				frequency: ReminderFrequencyDto.DAILY,
				time: '08:00',
				nextRunAt: null,
				lastSentAt: null,
			}
		);
	}

	async updateReminderConfig(dto: UpdateReminderConfigDto, authenticatedUser: JwtUserPayload) {
		const current = await this.prisma.reminderConfig.findUnique({
			where: { userId: authenticatedUser.id },
		});

		const active = dto.active ?? current?.active ?? false;
		const frequency = dto.frequency ?? current?.frequency ?? ReminderFrequencyDto.DAILY;
		const time = dto.time ?? current?.time ?? '08:00';

		return this.prisma.reminderConfig.upsert({
			where: { userId: authenticatedUser.id },
			create: {
				userId: authenticatedUser.id,
				active,
				frequency,
				time,
				nextRunAt: active ? this.calculateNextRunAt(frequency, time) : null,
			},
			update: {
				active,
				frequency,
				time,
				nextRunAt: active ? this.calculateNextRunAt(frequency, time) : null,
			},
		});
	}

	async findPending(authenticatedUser: JwtUserPayload) {
		return this.prisma.notification.findMany({
			where: {
				userId: authenticatedUser.id,
				readAt: null,
			},
			orderBy: { createdAt: 'desc' },
		});
	}

	async markAsRead(id: string, authenticatedUser: JwtUserPayload) {
		return this.prisma.notification.update({
			where: {
				id,
				userId: authenticatedUser.id,
			},
			data: {
				readAt: new Date(),
			},
		});
	}

	async processDueReminders() {
		const now = new Date();
		const dueReminders = await this.prisma.reminderConfig.findMany({
			where: {
				active: true,
				nextRunAt: {
					lte: now,
				},
			},
			include: {
				user: true,
			},
		});

		for (const reminder of dueReminders) {
			const title = 'Hora de registrar seus gastos';
			const message = 'Você tem um lembrete ativo para manter seu controle financeiro atualizado.';
			const notification = await this.prisma.notification.create({
				data: {
					userId: reminder.userId,
					title,
					message,
					scheduledFor: reminder.nextRunAt ?? now,
				},
			});

			let emailSentAt: Date | null = null;

			try {
				await this.mailService.sendReminderEmail({
					to: reminder.user.email,
					name: reminder.user.name,
					title,
					message,
				});
				emailSentAt = new Date();
				await this.prisma.notification.update({
					where: { id: notification.id },
					data: { emailSentAt },
				});
			} finally {
				await this.prisma.reminderConfig.update({
					where: { id: reminder.id },
					data: {
						lastSentAt: emailSentAt ?? now,
						nextRunAt: this.calculateNextRunAt(reminder.frequency, reminder.time, now),
					},
				});
			}
		}
	}

	private calculateNextRunAt(frequency: string, time: string, from = new Date()) {
		const [hours, minutes] = time.split(':').map(Number);
		const nextRunAt = new Date(from);
		nextRunAt.setSeconds(0, 0);
		nextRunAt.setHours(hours, minutes, 0, 0);

		if (nextRunAt <= from) {
			if (frequency === ReminderFrequencyDto.WEEKLY) {
				nextRunAt.setDate(nextRunAt.getDate() + 7);
			} else if (frequency === ReminderFrequencyDto.MONTHLY) {
				nextRunAt.setMonth(nextRunAt.getMonth() + 1);
			} else {
				nextRunAt.setDate(nextRunAt.getDate() + 1);
			}
		}

		return nextRunAt;
	}
}
