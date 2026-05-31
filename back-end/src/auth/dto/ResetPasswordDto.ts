import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
	@IsString({ message: 'O token deve ser uma string.' })
	@IsNotEmpty({ message: 'O token e obrigatorio.' })
	token!: string;

	@IsString({ message: 'A senha deve ser uma string.' })
	@MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
	password!: string;
}
