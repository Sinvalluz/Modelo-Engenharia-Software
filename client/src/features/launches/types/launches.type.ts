import type { CategoryType } from '@/types/category';

export type LaunchType = 'INCOME' | 'EXPENSES';

export type LaunchRequestDto = {
	userId: string;
	categoryId: string;
	type: LaunchType;
	value: number;
	date: string;
	description: string;
};

export type CreateLaunchResponse = {
	id: string;
	userId: string;
	categoryId: string;
	type: CategoryType;
	value: string;
	date: string;
	description: string;
	createdAt: string;
	updatedAt: string;
};

export type Launch = {
	id: string;
	userId: string;
	category: { id: string; name: string; color: string };
	type: LaunchType;
	value: string;
	date: string;
	description: string;
	createdAt: string;
	updatedAt: string;
};
