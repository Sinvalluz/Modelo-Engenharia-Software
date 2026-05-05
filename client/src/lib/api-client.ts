import Axios, { type AxiosResponse } from 'axios';
import { env } from '@/config/env';
import type { AuthLoginResponse, AuthRegisterResponse, FormLoginData, FormRegisterData, User } from '@/types/user';

export const api = Axios.create({
	baseURL: env.API_URL,
});

export function registerWithEmailAndPassword(data: FormRegisterData) {
	const payload = {
		...data,
		monthlyIncome: Number(data.monthlyIncome),
	};

	return api.post<AuthRegisterResponse>('auth/signup', payload);
}

export function loginWithEmailAndPassword(data: FormLoginData) {
	return api.post<FormLoginData, AxiosResponse<AuthLoginResponse>>('/auth/signin', data);
}

export function fetchMe(token: string, userId: string) {
	return api.get<any, AxiosResponse<User>>(`/user/${userId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
}
