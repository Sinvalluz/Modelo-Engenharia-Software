import { api } from '@/lib/api-client';
import type { CategoryRequestDto, CreateCategoryResponse } from '../types/category.type';

export default function createCategory(data: CategoryRequestDto) {
	return api.post<CreateCategoryResponse>('category', data);
}
