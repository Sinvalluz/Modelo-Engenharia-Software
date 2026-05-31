import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { env } from '../config/env';

type ReminderEmail = {
	to: string;
	name: string;
	title: string;
	message: string;
};

@Injectable()
export class MailService {
	private readonly transporter = env.SMTP_HOST
		? nodemailer.createTransport({
				host: env.SMTP_HOST,
				port: env.SMTP_PORT ?? 587,
				secure: (env.SMTP_PORT ?? 587) === 465,
				auth:
					env.SMTP_USER && env.SMTP_PASS
						? {
								user: env.SMTP_USER,
								pass: env.SMTP_PASS,
							}
						: undefined,
			})
		: nodemailer.createTransport({ jsonTransport: true });

	// email enviado para lembrar de atualizar o app
	async sendReminderEmail({ to, name, title, message }: ReminderEmail) {
		return this.transporter.sendMail({
			from: env.SMTP_FROM ?? 'Siscodep <no-reply@siscodep.local>',
			to,
			subject: title,
			text: `Olá, ${name}!\n\n${message}\n\nAcesse o Siscodep e registre suas movimentações financeiras.`,
			html: `
				<p>Olá, ${name}!</p>
				<p>${message}</p>
				<p>Acesse o Siscodep e registre suas movimentações financeiras.</p>
			`,
		});
	}
}
