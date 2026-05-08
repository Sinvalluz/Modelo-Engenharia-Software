import Cookies from 'js-cookie';
import { env } from '@/config/env';

export const setToken = (token: string) => {
	Cookies.set(env.TOKEN_KEY, token, {
		expires: 7, // dias
		secure: true, // só HTTPS
		sameSite: 'Strict',
	});
};

export const getToken = () => {
	return Cookies.get(env.TOKEN_KEY);
};

export const removeToken = () => {
	Cookies.remove(env.TOKEN_KEY);
};
