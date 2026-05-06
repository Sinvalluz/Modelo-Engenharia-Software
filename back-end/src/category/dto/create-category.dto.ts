import { IsEnum, IsHexadecimal, IsHexColor, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CategoryType } from '../../generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
	@ApiProperty({
		description: 'Nome da categoria',
		example: 'Lazer',
	})
	@IsString()
	@IsNotEmpty({ message: 'A categoria deve ter um nome.' })
	name!: string;

	@ApiProperty({
		description: 'Cor para representar a categoria',
		example: '#3B82F6',
	})
	@IsHexColor({
		message: 'Informe uma cor válida em hexadecimal (ex: #FFFFFF)',
	})
	@IsNotEmpty({ message: 'Escolha uma cor para a categoria.' })
	color!: string;

	@ApiProperty({
		description: 'Tipo de categoria',
		example: '"INCOME" | "EXPENSES"',
		enum: CategoryType,
	})
	@IsEnum(CategoryType, {
		message: 'O tipo deve ser "INCOME" ou "EXPENSES".',
	})
	@IsNotEmpty({ message: 'Defina um tipo de categoria.' })
	categoryType!: CategoryType;

	@ApiProperty({
		description: 'ID do usuário dono da categoria',
		example: 'uuid-do-usuario',
	})
	@IsUUID()
	@IsNotEmpty({ message: 'A categoria deve pertencer a um usuário.' })
	userId!: string;
}
