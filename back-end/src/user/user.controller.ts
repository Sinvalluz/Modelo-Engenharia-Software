import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Put,
	Request,
	Res,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUserDto';
import { UserGuard } from './user.guard';
import type { Response } from 'express';

import type { AuthenticatedRequest } from '../types';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/UserResponseDto';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@ApiOperation({ summary: 'Busca o usuário logado' })
	@ApiResponse({
		status: 200,
		description: 'Busca o usuário logado com sucesso.',
		type: UserResponseDto,
	})
	@ApiCookieAuth('access_token')
	@UseGuards(UserGuard)
	@Get('me')
	async findOne(@Request() req: AuthenticatedRequest) {
		return await this.userService.findOne(req.user);
	}

	@ApiOperation({ summary: 'Busca todos os usuários' })
	@ApiCookieAuth('access_token')
	@UseGuards(UserGuard)
	@Get('all')
	async findAll(@Request() req: AuthenticatedRequest) {
		return await this.userService.findAll(req.user);
	}

	@ApiOperation({ summary: 'Atualiza o usuário logado' })
	@ApiCookieAuth('access_token')
	@UseGuards(UserGuard)
	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
		@Request() req: AuthenticatedRequest,
	) {
		return await this.userService.update(id, updateUserDto, req.user);
	}

	@ApiOperation({ summary: 'Deleta o usuário logado' })
	@ApiCookieAuth('access_token')
	@UseGuards(UserGuard)
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(
		@Param('id') id: string,
		@Request() req: AuthenticatedRequest,
		@Res({ passthrough: true }) res: Response,
	) {
		await this.userService.remove(id, req.user);
		if (req.user.id === id) {
			res.clearCookie('access_token');
		}
		return;
	}
}
