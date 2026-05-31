import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserGuard } from '../user/user.guard';
import type { AuthenticatedRequest } from '../types';
import { UpdateReminderConfigDto } from './dto/update-reminder-config.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
@UseGuards(UserGuard)
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Get()
	findPending(@Request() req: AuthenticatedRequest) {
		return this.notificationService.findPending(req.user);
	}

	@Post(':id/read')
	markAsRead(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
		return this.notificationService.markAsRead(id, req.user);
	}

	@Get('reminder-config')
	getReminderConfig(@Request() req: AuthenticatedRequest) {
		return this.notificationService.getReminderConfig(req.user);
	}

	@Patch('reminder-config')
	updateReminderConfig(
		@Body(new ValidationPipe({ whitelist: true })) updateReminderConfigDto: UpdateReminderConfigDto,
		@Request() req: AuthenticatedRequest,
	) {
		return this.notificationService.updateReminderConfig(updateReminderConfigDto, req.user);
	}
}
