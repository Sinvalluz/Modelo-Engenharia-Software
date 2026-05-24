import type { CategoryType } from '@/types/category';

export type CreateLaunchRequestDto = {
	userId: string;
	categoryId: string;
	type: CategoryType;
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
	categoryId: string;
	type: CategoryType;
	value: string;
	date: string;
	description: string;
	createdAt: string;
	updatedAt: string;
};
