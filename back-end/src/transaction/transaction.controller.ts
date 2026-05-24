import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserGuard } from '../user/user.guard';

import type { AuthenticatedRequest } from '../types';

@Controller('transaction')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) { }

	@ApiOperation({ summary: 'Cria um novo lançamento' })
	@ApiResponse({
		status: 200,
		description: 'Cria um novo lançamento com sucesso',
		type: CreateTransactionDto,
	})
	@UseGuards(UserGuard)
	@Post()
	create(@Body() createTransactionDto: CreateTransactionDto, @Request() req: AuthenticatedRequest) {
		return this.transactionService.create(createTransactionDto, req.user);
	}

	@ApiOperation({ summary: 'Busca todos os lançamentos' })
	@ApiResponse({
		status: 200,
		description: 'Busca todos os lançamentos com sucesso',
		type: CreateTransactionDto,
	})
	@UseGuards(UserGuard)
	@Get()
	findAll(@Request() req: AuthenticatedRequest) {
		return this.transactionService.findAll(req.user);
	}

	@ApiOperation({ summary: 'Busca o lançamento especificado' })
	@ApiResponse({
		status: 200,
		description: 'Busca o lançamento com sucesso',
		type: CreateTransactionDto,
	})
	@UseGuards(UserGuard)
	@Get(':id')
	findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
		return this.transactionService.findOne(id, req.user);
	}

	@ApiOperation({ summary: 'Atualiza o lançamento especificado' })
	@ApiResponse({
		status: 200,
		description: 'Atualiza o lançamento com sucesso',
		type: CreateTransactionDto,
	})
	@UseGuards(UserGuard)
	@Put(':id')
	update(
		@Param('id') id: string,
		@Body() updateTransactionDto: UpdateTransactionDto,
		@Request() req: AuthenticatedRequest,
	) {
		return this.transactionService.update(id, updateTransactionDto, req.user);
	}

	@ApiOperation({ summary: 'Exclui o lançamento especificado' })
	@ApiResponse({
		status: 200,
		description: 'Exclui o lançamento com sucesso',
		type: CreateTransactionDto,
	})
	@UseGuards(UserGuard)
	@Delete(':id')
	remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
		return this.transactionService.remove(id, req.user);
	}
}
