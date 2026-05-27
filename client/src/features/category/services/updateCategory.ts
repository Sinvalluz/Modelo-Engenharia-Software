import { api } from '@/lib/api-client';
import type { CategoryResponse } from '@/types/category';

type UpdateCategoryParams = {
	id: string;
	data: Pick<CategoryResponse, 'name' | 'color' | 'categoryType'>;
};

export default function updateCategory({ id, data }: UpdateCategoryParams) {
	console.log(data);
	return api.put<CategoryResponse>(`category/${id}`, data);
}
