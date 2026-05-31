import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserGuard } from '../user/user.guard';
import type { AuthenticatedRequest } from '../types';
import { UpdateReminderConfigDto } from './dto/update-reminder-config.dto';
import { NotificationService } from './notification.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('notifications')
@UseGuards(UserGuard)
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@ApiOperation({ summary: 'Busca as notificações não lidas.' })
		@ApiResponse({
			status: 200,
			description: 'Buscas as notificações não lidas com sucesso.',
			type: UpdateReminderConfigDto,
		})
	@Get()
	findPending(@Request() req: AuthenticatedRequest) {
		return this.notificationService.findPending(req.user);
	}

	@ApiOperation({ summary: 'Marca a notificação como lida.' })
		@ApiResponse({
			status: 200,
			description: 'Marca a notificação como lida com sucesso.',
			type: UpdateReminderConfigDto,
		})
	@Post(':id/read')
	markAsRead(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
		return this.notificationService.markAsRead(id, req.user);
	}

	@ApiOperation({ summary: 'Busca as configurações de notificação.' })
		@ApiResponse({
			status: 200,
			description: 'Busca as configurações de notificação com sucesso.',
			type: UpdateReminderConfigDto,
		})
	@Get('reminder-config')
	getReminderConfig(@Request() req: AuthenticatedRequest) {
		return this.notificationService.getReminderConfig(req.user);
	}

	@ApiOperation({ summary: 'Atualiza as configurações de notificação.' })
		@ApiResponse({
			status: 200,
			description: 'Atualiza as configurações de notificação com sucesso.',
			type: UpdateReminderConfigDto,
		})
	@Patch('reminder-config')
	updateReminderConfig(
		@Body(new ValidationPipe({ whitelist: true })) updateReminderConfigDto: UpdateReminderConfigDto,
		@Request() req: AuthenticatedRequest,
	) {
		return this.notificationService.updateReminderConfig(updateReminderConfigDto, req.user);
	}
}
