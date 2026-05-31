import { IsBoolean, IsEnum, IsOptional, Matches } from 'class-validator';

export enum ReminderFrequencyDto {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
}

export class UpdateReminderConfigDto {
	@IsOptional()
	@IsBoolean()
	active?: boolean;

	@IsOptional()
	@IsEnum(ReminderFrequencyDto)
	frequency?: ReminderFrequencyDto;

	@IsOptional()
	@Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
		message: 'O horário deve estar no formato HH:mm.',
	})
	time?: string;
}
