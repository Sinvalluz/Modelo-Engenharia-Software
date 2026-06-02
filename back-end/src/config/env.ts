import { z } from 'zod';
import 'dotenv/config';

export const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string(),
	DIRECT_URL: z.string(),
	JWT_SECRET: z.string(),
	SMTP_HOST: z.string().optional(),
	SMTP_PORT: z.coerce.number().optional(),
	SMTP_USER: z.string().optional(),
	SMTP_PASS: z.string().optional(),
	SMTP_FROM: z.string().email().optional(),
	FRONTEND_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
