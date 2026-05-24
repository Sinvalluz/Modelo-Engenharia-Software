import { ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'; // BadRequestException
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtUserPayload } from '../types';

@Injectable()
export class TransactionService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createTransactionDto: CreateTransactionDto, authenticatedUser: JwtUserPayload) {
		let value = createTransactionDto.value;
		if (value <= 0) {
			throw new UnprocessableEntityException(
				`O valor ${value} não é aceito como um valor válido. Por favor insira um número igual ou acima de 0.`,
			);
		}

		return this.prisma.launch.create({
			data: {
				type: createTransactionDto.type,
				value: createTransactionDto.value,
				date: new Date(createTransactionDto.date),
				description: createTransactionDto.description,
				categoryId: createTransactionDto.categoryId,
				userId: authenticatedUser.id,
			},
		});
	}

	async findAll(authenticatedUser: JwtUserPayload) {
		return await this.prisma.launch.findMany({
			where: {
				userId: authenticatedUser.id,
			},
			select: {
				id: true,
				type: true,
				value: true,
				date: true,
				description: true,
				createdAt: true,
				updatedAt: true,
				userId: true,
				category: {
					select: {
						id: true,
						name: true,
						color: true,
					},
				},
			},
		});
	}

	async findOne(id: string, authenticatedUser: JwtUserPayload) {
		const existingTransaction = await this.prisma.launch.findUnique({
			where: { id },
		});

		if (!existingTransaction) {
			throw new NotFoundException(`Transação número ${id} não encontrado.`);
		} else if (existingTransaction.userId !== authenticatedUser.id)
			throw new ForbiddenException('Acesso negado. Permissão insuficiente.');

		return existingTransaction;
	}

	async update(id: string, updateTransactionDto: UpdateTransactionDto, authenticatedUser: JwtUserPayload) {
		const { type, value, date, description, categoryId } = updateTransactionDto;

		if (value !== undefined && value <= 0) {
			throw new UnprocessableEntityException(
				`O valor ${value} não é aceito como um valor válido. Por favor insira um número igual ou acima de 0.`,
			);
		}

		const existingTransaction = await this.prisma.launch.findUnique({
			where: { id },
		});

		if (!existingTransaction) throw new NotFoundException('Lançamento não encontrado.');
		else if (authenticatedUser.id !== existingTransaction.userId)
			throw new ForbiddenException('Acesso negado. Permissão insuficiente.');

		return this.prisma.launch.update({
			where: { id },
			data: {
				...(type && { type }),
				...(value !== undefined && { value }),
				...(date && { date: new Date(date) }),
				...(description && { description }),
				...(categoryId && { categoryId }),
			},
		});
	}

	async remove(id: string, authenticatedUser: JwtUserPayload) {
		const existingTransaction = await this.prisma.launch.findUnique({
			where: { id },
		});

		if (!existingTransaction) throw new NotFoundException('Lançamento não encontrado.');
		else if (authenticatedUser.id !== existingTransaction.userId)
			throw new ForbiddenException('Acesso negado. Permissão insuficiente.');

		return this.prisma.launch.delete({
			where: { id },
		});
	}
}
