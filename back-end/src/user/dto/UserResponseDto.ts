import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../types';

export class UserResponseDto {
	@ApiProperty({
		description: 'ID do usuário',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id!: string;

	@ApiProperty({
		description: 'E-mail do usuário',
		example: 'joao@exemplo.com.br',
	})
	email!: string;

	@ApiProperty({
		description: 'Nome do usuário',
		example: 'João Silva',
	})
	name!: string;

	@ApiProperty({
		description: 'Data de criação do usuário',
	})
	createdAt!: Date;

	@ApiProperty({
		enum: Role,
		enumName: 'Role',
	})
	role!: Role;

	@ApiProperty({
		description: 'Renda mensal bruta do usuário',
		example: 3500.5,
	})
	monthlyIncome!: number;

	@ApiProperty({
		description: 'Número de telefone do usuário',
	})
	phoneNumber!: string;

	@ApiProperty({
		description: 'Data de atualização do usuário',
	})
	updatedAt!: Date;
}
