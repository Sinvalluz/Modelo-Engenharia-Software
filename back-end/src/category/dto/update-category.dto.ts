import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsHexColor, IsNotEmpty, IsString } from 'class-validator';
import { CategoryType } from '../../generated/prisma/enums';

export class UpdateCategoryDto {
	@ApiProperty({
		description: 'Nome da categoria',
		example: 'Educação',
		required: true,
	})
	@IsString()
	@IsNotEmpty({ message: 'A categoria deve ter um nome.' })
	name!: string;

	@ApiProperty({
		description: 'Cor para representar a categoria',
		example: '#0400FF',
		required: true,
	})
	@IsHexColor({
		message: 'Informe uma cor válida em hexadecimal (ex: #FFFFFF)',
	})
	@IsNotEmpty({ message: 'Escolha uma cor para a categoria.' })
	color!: string;

	@ApiProperty({
		description: 'Tipo de categoria',
		example: 'EXPENSES',
		enum: CategoryType,
		required: true,
	})
	@IsEnum(CategoryType, {
		message: 'O tipo deve ser "INCOME" ou "EXPENSES".',
	})
	@IsNotEmpty({ message: 'Defina um tipo de categoria.' })
	categoryType!: CategoryType;
}
