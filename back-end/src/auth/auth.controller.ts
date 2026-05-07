import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUserDto';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { LoginUserDto } from './dto/LoginUserDto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	// POST /auth/signup
	@ApiOperation({ summary: 'Registrar um novo usuário' })
	@ApiResponse({
		status: 201,
		description: 'Usuário criado com sucesso.',
		schema: {
			example: { message: 'Usuário criado com sucesso' },
		},
	})
	@Post('signup')
	async register(@Body(new ValidationPipe()) body: CreateUserDto) {
		await this.authService.register(body);
		return { message: 'Usuário criado com sucesso' };
	}

	// POST /auth/signin
	@ApiOperation({ summary: 'Logar com o usuário' })
	@ApiResponse({
		status: 201,
		description: 'Login realizado com sucesso.',
		schema: {
			example: { message: 'Login realizado com sucesso' },
		},
	})
	@Post('signin')
	async login(@Body(new ValidationPipe()) body: LoginUserDto, @Res({ passthrough: true }) response: Response) {
		const token = await this.authService.login(body);

		response.cookie('access_token', token, {
			httpOnly: true, // JS do browser não consegue acessar
			secure: true, // Apenas HTTPS (use false em dev local)
			sameSite: 'strict', // Proteção contra CSRF
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias em ms
		});

		return { message: 'Login realizado com sucesso' };
	}

	// POST /auth/logout
	@ApiOperation({ summary: 'Sair da sessão do usuário' })
	@ApiResponse({
		status: 204,
		description: 'Logout realizado com sucesso.',
		schema: {
			example: { message: 'Logout realizado com sucesso' },
		},
	})
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const token = req.cookies?.access_token;

		if (!token) {
			return { message: 'Nenhuma sessão ativa encontrada.' };
		}
		res.clearCookie('access_token');
		return { message: 'Logout realizado com sucesso' };
	}
}
