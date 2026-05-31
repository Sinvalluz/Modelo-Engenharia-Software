import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from '../config/env';
import { PrismaModule } from '../prisma/prisma.module';
import { MailService } from './mail.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
	imports: [PrismaModule, JwtModule.register({
			secret: env.JWT_SECRET,
		}),
	],
	controllers: [NotificationController],
	providers: [NotificationService, MailService],
	exports: [MailService],
})
export class NotificationModule {}
