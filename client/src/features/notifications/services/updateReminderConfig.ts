import { api } from '@/lib/api-client';
import type { ReminderConfig, UpdateReminderConfigPayload } from '../types/notification.type';

export default function updateReminderConfig(payload: UpdateReminderConfigPayload) {
	return api.patch<ReminderConfig>('notifications/reminder-config', payload);
}
