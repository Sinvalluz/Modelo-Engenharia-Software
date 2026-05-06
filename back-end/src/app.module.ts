import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env';
import z from 'zod';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (env) => {
				const parsed = envSchema.safeParse(env);

				if (!parsed.success) {
					console.error(z.treeifyError(parsed.error));
					throw new Error('Variáveis de ambiente inválidas');
				}

				return parsed.data;
			},
		}),
		HealthModule,
		AuthModule,
		UserModule,
		PrismaModule,
		CategoryModule,
		TransactionModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
