import Axios, { type AxiosResponse } from 'axios';
import type z from 'zod';
import { env } from '@/config/env';
import type {
	AuthLoginResponse,
	AuthRegisterResponse,
	FormForgotPasswordData,
	FormLoginData,
	FormRegisterDataSchema,
	User,
} from '@/types/user';

export const api = Axios.create({
	baseURL: env.API_URL,
	withCredentials: true,
});

type Data = Omit<z.infer<typeof FormRegisterDataSchema>, 'monthlyIncome' | 'phoneNumber'> & {
	monthlyIncome?: number;
	phoneNumber?: string;
};
export async function registerWithEmailAndPassword(data: Data) {
	const payload = {
		...data,
		monthlyIncome: Number(data.monthlyIncome),
	};

	return await api.post<AuthRegisterResponse>('auth/signup', payload);
}

export async function loginWithEmailAndPassword(data: FormLoginData) {
	return await api.post<FormLoginData, AxiosResponse<AuthLoginResponse>>('/auth/signin', data);
}

export async function requestPasswordReset(data: FormForgotPasswordData) {
	return await api.post<FormForgotPasswordData, AxiosResponse<{ message: string }>>('/auth/forgot-password', data);
}

export async function fetchMe() {
	return await api.get<any, AxiosResponse<User>>('/user/me');
}

export async function logout() {
	return await api.post('/auth/logout');
}
