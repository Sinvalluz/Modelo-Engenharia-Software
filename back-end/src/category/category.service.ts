import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtUserPayload } from '../types';

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, authenticatedUser: JwtUserPayload) {
    if(createCategoryDto.userId !== authenticatedUser.id){
      throw new ForbiddenException('Acesso negado. Não é permitido utilizar o ID de outro usuário.')
    }

    const existingCategory = await this.prisma.category.findFirst({
      where: { userId: createCategoryDto.userId, name: createCategoryDto.name }
    })
    if (existingCategory) throw new ConflictException('Categoria já existente. Caso queira criar uma nova, utilize outro nome.')

		return this.prisma.category.create({
			data: {
				name: createCategoryDto.name,
				color: createCategoryDto.color,
				categoryType: createCategoryDto.categoryType,
				userId: createCategoryDto.userId,
			},
		});
	}

	async findAll(authenticatedUser: JwtUserPayload) {
		return this.prisma.category.findMany({
			where: { userId: authenticatedUser.id },
		});
	}

	async findOne(id: string, authenticatedUser: JwtUserPayload) {
		const existingCategory = await this.prisma.category.findUnique({
			where: { id, userId: authenticatedUser.id },
		});

		if (!existingCategory) throw new NotFoundException('Categoria não encontrada.');

		return existingCategory;
	}

	async update(id: string, updateCategoryDto: UpdateCategoryDto, authenticatedUser: JwtUserPayload) {
		const existingCategory = await this.prisma.category.findUnique({
			where: { id, userId: authenticatedUser.id },
		});

		if (!existingCategory) throw new NotFoundException('Categoria não encontrada.');

		const categoryWithSameName = await this.prisma.category.findFirst({
			where: {
				userId: authenticatedUser.id,
				name: updateCategoryDto.name,
				id: { not: id },
			},
		});

		if (categoryWithSameName) {
			throw new ConflictException('Categoria já existente. Caso queira criar uma nova, utilize outro nome.');
		}

		return this.prisma.category.update({
			where: { id },
			data: {
				name: updateCategoryDto.name,
				color: updateCategoryDto.color,
				categoryType: updateCategoryDto.categoryType,
			},
		});
	}

	async remove(id: string, authenticatedUser: JwtUserPayload) {
		const existingCategory = await this.prisma.category.findUnique({
			where: { id, userId: authenticatedUser.id },
		});

		if (!existingCategory) throw new NotFoundException('Categoria não encontrada.');

		const linkedLaunchesCount = await this.prisma.launch.count({
			where: {
				categoryId: id,
				userId: authenticatedUser.id,
			},
		});

		if (linkedLaunchesCount > 0) {
			throw new ConflictException('Não é possível excluir uma categoria que possui lançamentos vinculados.');
		}

		return this.prisma.category.delete({
			where: { id },
		});
	}
}
