import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPhoneNumber,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@ApiProperty({
		description: 'Nome completo do usuário',
		example: 'João Silva',
	})
	@IsString({ message: 'O nome deve ser um texto válido.' })
	@IsNotEmpty({ message: 'O nome não pode estar vazio.' })
	name!: string;

	@ApiProperty({
		description: 'E-mail para login e notificações',
		example: 'joao@exemplo.com.br',
	})
	@IsEmail({}, { message: 'O e-mail informado não é válido.' })
	@IsNotEmpty({ message: 'O e-mail é obrigatório.' })
	email!: string;

	@ApiProperty({
		description: 'Senha de acesso (mínimo 8 caracteres)',
		example: 'Senha@123',
		minLength: 8,
		format: 'password',
	})
	@IsString({ message: 'A senha deve ser uma string.' })
	@MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
	password!: string;

	@ApiProperty({
		description: 'Número de telefone no padrão brasileiro',
		example: '+55 71 99999-9999',
	})
	@IsPhoneNumber('BR', {
		message: 'O número de telefone deve ser um formato válido do Brasil (Ex: +55 71999999999).',
	})
	@Matches(/^\+55\s\d{2}\s\d{4,5}-\d{4}$/, { message: 'Digite um telefone válido (ex: +55 71 99618-6907)' })
	@IsOptional()
	phoneNumber!: string;

	@ApiProperty({
		description: 'Renda mensal bruta do usuário',
		example: 3500.5,
	})
	@IsNumber({}, { message: 'A renda mensal deve ser um valor numérico.' })
	@IsOptional()
	monthlyIncome!: number;
}
