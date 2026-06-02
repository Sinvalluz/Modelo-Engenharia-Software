import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, Matches } from 'class-validator';

export enum ReminderFrequencyDto {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
}

export class UpdateReminderConfigDto {


	@ApiProperty({
		description: 'Indica se a notificação está ligada ou não.',
		example: '"true" | "false"',
		required: false
	})	
	@IsOptional()
	@IsBoolean()
	active?: boolean;

	@ApiProperty({
		description: 'Frequência de notificações.',
		example: '"WEEKLY" | "DAILY" | "MONTHLY"' ,
		required: false
	})	
	@IsOptional()
	@IsEnum(ReminderFrequencyDto)
	frequency?: ReminderFrequencyDto;

	@ApiProperty({
		description: 'Horário da notificação.',
		example: '13:55',
		required: false
	})	
	@IsOptional()
	@Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
		message: 'O horário deve estar no formato HH:mm.',
	})
	time?: string;
}
