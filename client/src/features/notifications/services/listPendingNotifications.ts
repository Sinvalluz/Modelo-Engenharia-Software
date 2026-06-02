import { api } from '@/lib/api-client';
import type { NotificationItem } from '../types/notification.type';

export default function listPendingNotifications() {
	return api.get<NotificationItem[]>('notifications');
}
