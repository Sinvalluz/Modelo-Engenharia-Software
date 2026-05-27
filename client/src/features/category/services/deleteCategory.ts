import { api } from '@/lib/api-client';

export default function deleteCategory(id: string) {
	return api.delete(`category/${id}`);
}
