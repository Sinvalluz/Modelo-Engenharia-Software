import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserGuard } from '../user/user.guard';

import type { AuthenticatedRequest } from '../types';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) { }

	@ApiOperation({ summary: 'Cria uma nova categoria' })
	@ApiResponse({
		status: 200,
		description: 'Cria uma nova categoria com sucesso',
		type: CreateCategoryDto,
	})
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Post()
	create(@Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto, @Request() req: AuthenticatedRequest) {
		return this.categoryService.create(createCategoryDto, req.user);
	}

	@ApiOperation({ summary: 'Busca todas as categorias' })
	@ApiResponse({
		status: 200,
		description: 'Busca todas as categorias com sucesso',
		type: CreateCategoryDto,
	})
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Get()
	findAll(@Request() req: AuthenticatedRequest) {
		return this.categoryService.findAll(req.user);
	}

	@ApiOperation({ summary: 'Busca a categoria especificada' })
	@ApiResponse({
		status: 200,
		description: 'Busca a categoria com sucesso',
		type: CreateCategoryDto,
	})
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Get(':id')
	findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
		return this.categoryService.findOne(id, req.user);
	}

	@ApiOperation({ summary: 'Atualiza a categoria especificada' })
	@ApiResponse({
		status: 200,
		description: 'Atualiza a categoria com sucesso',
		type: CreateCategoryDto,
	})
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Put(':id')
	update(
		@Param('id') id: string,
		@Body(new ValidationPipe()) updateCategoryDto: UpdateCategoryDto,
		@Request() req: AuthenticatedRequest,
	) {
		return this.categoryService.update(id, updateCategoryDto, req.user);
	}

	@ApiOperation({ summary: 'Exclui a categoria especificada' })
	@ApiResponse({
		status: 200,
		description: 'Exclui a categoria com sucesso',
		type: CreateCategoryDto,
	})
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Delete(':id')
	remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
		return this.categoryService.remove(id, req.user);
	}
}
