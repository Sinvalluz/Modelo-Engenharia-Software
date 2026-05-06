import { z } from 'zod';
import 'dotenv/config';

export const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string(),
	DIRECT_URL: z.string(),
	JWT_SECRET: z.string(),
	APP_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
