import { api } from '@/lib/api-client';
import type { CreateLaunchResponse, LaunchRequestDto } from '../types/launches.type';

export default function createLaunches(data: LaunchRequestDto) {
	return api.post<CreateLaunchResponse>('transaction', data);
}
