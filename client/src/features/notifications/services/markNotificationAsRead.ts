import { api } from '@/lib/api-client';
import type { NotificationItem } from '../types/notification.type';

export default function markNotificationAsRead(id: string) {
	return api.post<NotificationItem>(`notifications/${id}/read`);
}
