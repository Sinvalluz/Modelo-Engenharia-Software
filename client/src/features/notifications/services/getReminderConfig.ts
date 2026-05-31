import { api } from '@/lib/api-client';
import type { ReminderConfig } from '../types/notification.type';

export default function getReminderConfig() {
	return api.get<ReminderConfig>('notifications/reminder-config');
}
