import { api } from '@/lib/api-client';
import type { CreateLaunchRequestDto, CreateLaunchResponse } from '../types/launches.type';

type UpdateLaunchesParams = {
	id: string;
	data: Omit<CreateLaunchRequestDto, 'userId'>;
};

export default function updateLaunches({ id, data }: UpdateLaunchesParams) {
	return api.put<CreateLaunchResponse>(`transaction/${id}`, data);
}
