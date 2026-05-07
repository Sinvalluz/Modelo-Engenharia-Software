import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UserGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromCookie(request);

		if (!token) {
			throw new UnauthorizedException('Token de autenticação não fornecido.');
		}

		try {
			const payload = this.jwtService.verify(token) as { id: string; email: string; role: string };

			request['user'] = payload;
		} catch (error) {
			throw new UnauthorizedException('Token de autenticação inválido.');
		}
		return true;
	}

	private extractTokenFromCookie(request: Request): string | undefined {
		console.log('Cookies:', request.cookies); // 👈
		return request.cookies?.access_token;
	}
}
