import { api } from '@/lib/api-client';

export default function deleteLaunches(id: string) {
	return api.delete(`transaction/${id}`);
}
