import type { CategoryType } from '@/types/category';

export type CreateLaunchRequestDto = {
	type: CategoryType;
	value: number;
	date: string;
	categoryId: string;
	description: string;
	paymentMethod: string;
	account: string;
	installmentsQuantity: number;
	userId: string;
};

export type CreateLaunchResponse = {
	id: string;
	userId: string;
	categoryId: string;
	type: CategoryType;
	value: string;
	date: string;
	description: string;
	paymentMethod: string;
	account: string;
	installmentsQuantity: number;
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
	paymentMethod: string;
	account: string;
	installmentsQuantity: number;
	createdAt: string;
	updatedAt: string;
};
