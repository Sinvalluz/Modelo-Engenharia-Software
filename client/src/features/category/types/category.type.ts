export type CategoryRequestDto = {
	name: string;
	color: string;
	categoryType: string;
	userId: string;
};

export type CreateCategoryResponse = {
	id: string;
	name: string;
	color: string;
	categoryType: 'EXPENSES' | 'INCOME';
	createdAt: Date;
	updatedAt: Date;
	userId: string;
};
