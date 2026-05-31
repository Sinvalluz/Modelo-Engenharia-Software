import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from '../config/env';
import { NotificationModule } from '../notification/notification.module';
@Module({
	imports: [
		UserModule,
		PrismaModule,
		NotificationModule,
		JwtModule.register({
			global: true,
			secret: env.JWT_SECRET,
			signOptions: { expiresIn: '7d' },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
