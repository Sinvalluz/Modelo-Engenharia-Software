import { api } from '@/lib/api-client';
import type { CreateLaunchResponse, LaunchRequestDto } from '../types/launches.type';

type UpdateLaunchesParams = {
	id: string;
	data: Omit<LaunchRequestDto, 'userId'>;
};

export default function updateLaunches({ id, data }: UpdateLaunchesParams) {
	return api.put<CreateLaunchResponse>(`transaction/${id}`, data);
}
