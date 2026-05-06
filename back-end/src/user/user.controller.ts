import { Body, Controller, Delete, Get, Param, Put, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUserDto';
import { UserGuard } from './user.guard';

import type { AuthenticatedRequest } from '../types';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Get(':id')
	async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
		return await this.userService.findOne(id, req.user);
	}

	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Get()
	async findAll(@Request() req: AuthenticatedRequest) {
		return await this.userService.findAll(req.user);
	}

	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
		@Request() req: AuthenticatedRequest,
	) {
		return await this.userService.update(id, updateUserDto, req.user);
	}

	@ApiBearerAuth()
	@UseGuards(UserGuard)
	@Delete(':id')
	async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
		return await this.userService.remove(id, req.user);
	}
}
