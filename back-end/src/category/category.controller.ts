import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserGuard } from '../user/user.guard';

import type { AuthenticatedRequest } from '../types';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Post()
	create(@Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto, @Request() req: AuthenticatedRequest) {
		return this.categoryService.create(createCategoryDto, req.user);
	}

	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Get()
	findAll(@Request() req: AuthenticatedRequest) {
		return this.categoryService.findAll(req.user);
	}

	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Get(':id')
	findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
		return this.categoryService.findOne(id, req.user);
	}

	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body(new ValidationPipe()) updateCategoryDto: UpdateCategoryDto,
		@Request() req: AuthenticatedRequest,
	) {
		return this.categoryService.update(id, updateCategoryDto, req.user);
	}

	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Delete(':id')
	remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
		return this.categoryService.remove(id, req.user);
	}
}
