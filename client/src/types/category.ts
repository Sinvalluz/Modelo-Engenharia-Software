export type CategoryType = 'INCOME' | 'EXPENSES';

export interface CategoryResponse {
	id: string;
	name: string;
	color: string;
	categoryType: CategoryType;
	createdAt: string;
	updatedAt: string;
	userId: string;
}
