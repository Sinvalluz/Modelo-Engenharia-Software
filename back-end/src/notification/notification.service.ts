import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtUserPayload } from '../types';
import { ReminderFrequencyDto, UpdateReminderConfigDto } from './dto/update-reminder-config.dto';
import { MailService } from './mail.service';

const ONE_MINUTE = 60_000;
const LOCAL_TIMEZONE_OFFSET_IN_MINUTES = -3 * 60;
const LOCAL_TIMEZONE_OFFSET = '-03:00';

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

	// busca a configuração de notificações do usuário
	async getReminderConfig(authenticatedUser: JwtUserPayload) {
		const config = await this.prisma.reminderConfig.findUnique({
			where: { userId: authenticatedUser.id },
		});

		return this.formatReminderConfig(
			config ?? {
				active: false,
				frequency: ReminderFrequencyDto.DAILY,
				time: '08:00',
				nextRunAt: null,
				lastSentAt: null,
			},
		);
	}

	// atualiza a configuração de notificações do usuário
	async updateReminderConfig(dto: UpdateReminderConfigDto, authenticatedUser: JwtUserPayload) {
		const current = await this.prisma.reminderConfig.findUnique({
			where: { userId: authenticatedUser.id },
		});

		const active = dto.active ?? current?.active ?? false;
		const frequency = dto.frequency ?? current?.frequency ?? ReminderFrequencyDto.DAILY;
		const time = dto.time ?? current?.time ?? '08:00';

		const nextRunAt = active ? this.calculateNextRunAt(frequency, time) : null;

		const config = await this.prisma.reminderConfig.upsert({
			where: { userId: authenticatedUser.id },
			create: {
				userId: authenticatedUser.id,
				active,
				frequency,
				time,
				nextRunAt,
			},
			update: {
				active,
				frequency,
				time,
				nextRunAt,
			},
		});

		return this.formatReminderConfig(config);
	}

	// busca notificações não lidas
	async findPending(authenticatedUser: JwtUserPayload) {
		return this.prisma.notification.findMany({
			where: {
				userId: authenticatedUser.id,
				readAt: null,
			},
			orderBy: { createdAt: 'desc' },
		});
	}

	// marca a notificação como lida
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

	// prepara os emails a serem lançados
	async processDueReminders() {
		const now = new Date();
		const databaseNow = this.toDatabaseLocalDate(now);
		const dueReminders = await this.prisma.reminderConfig.findMany({
			where: {
				active: true,
				nextRunAt: {
					lte: databaseNow,
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
					scheduledFor: reminder.nextRunAt ?? databaseNow,
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
				emailSentAt = this.toDatabaseLocalDate(new Date());
				await this.prisma.notification.update({
					where: { id: notification.id },
					data: { emailSentAt },
				});
			} finally {
				await this.prisma.reminderConfig.update({
					where: { id: reminder.id },
					data: {
						lastSentAt: emailSentAt ?? databaseNow,
						nextRunAt: this.calculateNextRunAt(reminder.frequency, reminder.time, now),
					},
				});
			}
		}
	}

	// calcula a próxima notificação
	private calculateNextRunAt(frequency: string, time: string, from = new Date()): Date {
		const [hours, minutes] = time.split(':').map(Number);
		const localFrom = this.toDatabaseLocalDate(from);
		const nextRunAt = new Date(
			Date.UTC(
				localFrom.getUTCFullYear(),
				localFrom.getUTCMonth(),
				localFrom.getUTCDate(),
				hours,
				minutes,
				0,
				0,
			),
		);

		if (nextRunAt <= localFrom) {
			if (frequency === ReminderFrequencyDto.WEEKLY) {
				nextRunAt.setUTCDate(nextRunAt.getUTCDate() + 7);
			} else if (frequency === ReminderFrequencyDto.MONTHLY) {
				nextRunAt.setUTCMonth(nextRunAt.getUTCMonth() + 1);
			} else {
				nextRunAt.setUTCDate(nextRunAt.getUTCDate() + 1);
			}
		}

		return nextRunAt;
	}

	private toDatabaseLocalDate(date: Date): Date {
		return new Date(date.getTime() + LOCAL_TIMEZONE_OFFSET_IN_MINUTES * 60_000);
	}

	private formatReminderConfig<T extends { nextRunAt?: Date | null; lastSentAt?: Date | null }>(config: T) {
		return {
			...config,
			nextRunAt: config.nextRunAt ? this.formatLocalDateTime(config.nextRunAt) : null,
			lastSentAt: config.lastSentAt ? this.formatLocalDateTime(config.lastSentAt) : null,
		};
	}

	private formatLocalDateTime(date: Date): string {
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const day = String(date.getUTCDate()).padStart(2, '0');
		const hours = String(date.getUTCHours()).padStart(2, '0');
		const minutes = String(date.getUTCMinutes()).padStart(2, '0');
		const seconds = String(date.getUTCSeconds()).padStart(2, '0');

		return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${LOCAL_TIMEZONE_OFFSET}`;
	}
}
