import type { CategoryResponse } from '@/types/category';
import { api } from './api-client';

export default function findAllCategories() {
	return api.get<CategoryResponse[]>('category');
}
