import { api } from '@/lib/api-client';
import type { CreateLaunchRequestDto, CreateLaunchResponse } from '../types/launches.type';

export default function createLaunches(data: CreateLaunchRequestDto) {
	return api.post<CreateLaunchResponse>('transaction', data);
}
