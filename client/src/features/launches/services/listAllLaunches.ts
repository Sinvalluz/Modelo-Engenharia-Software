import { api } from '@/lib/api-client';
import type { Launch } from '../types/launches.type';

export default function listAllLaunches() {
	return api.get<Launch[]>('transaction');
}
