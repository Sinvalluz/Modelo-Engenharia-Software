import Axios, { type AxiosResponse } from 'axios';
import { env } from '@/config/env';
import type { AuthLoginResponse, AuthRegisterResponse, FormLoginData, FormRegisterData, User } from '@/types/user';

export const api = Axios.create({
	baseURL: env.API_URL,
	withCredentials: true,
});

export async function registerWithEmailAndPassword(data: FormRegisterData) {
	const payload = {
		...data,
		monthlyIncome: Number(data.monthlyIncome),
	};

	return await api.post<AuthRegisterResponse>('auth/signup', payload);
}

export async function loginWithEmailAndPassword(data: FormLoginData) {
	return await api.post<FormLoginData, AxiosResponse<AuthLoginResponse>>('/auth/signin', data);
}

export async function fetchMe() {
	return await api.get<any, AxiosResponse<User>>('/user/me');
}

export async function logout() {
	return await api.post('/auth/logout');
}
