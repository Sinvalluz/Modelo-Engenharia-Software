export type ReminderFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type ReminderConfig = {
	id?: string;
	active: boolean;
	frequency: ReminderFrequency;
	time: string;
	nextRunAt: string | null;
	lastSentAt: string | null;
};

export type NotificationItem = {
	id: string;
	title: string;
	message: string;
	scheduledFor: string;
	emailSentAt: string | null;
	readAt: string | null;
	createdAt: string;
};

export type UpdateReminderConfigPayload = {
	active: boolean;
	frequency: ReminderFrequency;
	time: string;
};
