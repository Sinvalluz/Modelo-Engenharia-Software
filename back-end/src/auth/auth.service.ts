import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/LoginUserDto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { env } from '../config/env';
import { MailService } from '../notification/mail.service';
import { ResetPasswordDto } from './dto/ResetPasswordDto';

const PASSWORD_RESET_TOKEN_EXPIRES_IN = '15m';
const PASSWORD_RESET_PUBLIC_URL = `${env.FRONTEND_URL ?? 'http://localhost:5173'}/auth/reset-password`;

type PasswordResetTokenPayload = {
	id: string;
	email: string;
	purpose: 'password-reset';
};

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private prismaService: PrismaService,
		private jwtService: JwtService,
		private mailService: MailService,
	) {}

	async register(createUserDto: CreateUserDto) {
		const user = await this.userService.create(createUserDto);
		return user;
	}

	async login(loginUserDto: LoginUserDto) {
		// Verifica se o usuário existe
		const user = await this.prismaService.user.findUnique({ where: { email: loginUserDto.email } });
		if (!user) throw new BadRequestException('Verifique as credenciais e tente novamente.');

		// Verifica se a senha é valida
		const isValidPassword = await compare(loginUserDto.password, user.hashedPassword);
		if (!isValidPassword) throw new BadRequestException('Verifique as credenciais e tente novamente.');

		// Gera o token JWT
		const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });

		return token;
	}

	async forgotPassword(email: string) {
		const user = await this.prismaService.user.findUnique({ where: { email } });

		if (user) {
			const token = this.jwtService.sign(
				{ id: user.id, email: user.email, purpose: 'password-reset' },
				{ secret: env.JWT_SECRET, expiresIn: PASSWORD_RESET_TOKEN_EXPIRES_IN },
			);

			const resetUrl = `${PASSWORD_RESET_PUBLIC_URL}?token=${encodeURIComponent(token)}`;

			await this.mailService.sendPasswordResetEmail({
				to: user.email,
				name: user.name,
				resetUrl,
			});
		}

		return {
			message: 'Se o email informado estiver cadastrado, você receberá as instruções de recuperação.',
		};
	}

	async resetPassword({ token, password }: ResetPasswordDto) {
		try {
			const payload = this.jwtService.verify<PasswordResetTokenPayload>(token, { secret: env.JWT_SECRET });

			if (payload.purpose !== 'password-reset') {
				throw new BadRequestException('Token de recuperacao invalido.');
			}

			const hashedPassword = await hash(password, 10);

			await this.prismaService.user.update({
				where: { id: payload.id, email: payload.email },
				data: { hashedPassword },
			});

			return { message: 'Senha redefinida com sucesso.' };
		} catch {
			throw new BadRequestException('Token de recuperacao invalido ou expirado.');
		}
	}
}
