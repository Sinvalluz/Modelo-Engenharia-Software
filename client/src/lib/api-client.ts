import Axios, { type AxiosResponse } from 'axios';
import { env } from '@/config/env';
import type { AuthLoginResponse, AuthRegisterResponse, FormLoginData, FormRegisterData } from '@/types/user';

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
