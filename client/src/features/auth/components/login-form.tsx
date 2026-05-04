import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useAuth } from '@/context/AuthContext';
import { loginWithEmailAndPassword } from '@/lib/api-client';
import { setToken } from '@/lib/cookies';
import { type FormLoginData, FormLoginDataSchema } from '@/types/user';
import HookFormInput from './hook-form-input';

interface LoginFormProps extends React.ComponentProps<'form'> {}

export default function LoginForm({ ...props }: LoginFormProps) {
	const { saveUser } = useAuth();
	const { handleSubmit, control } = useForm<FormLoginData>({
		resolver: zodResolver(FormLoginDataSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get('redirectTo');

	const login = useMutation({
		mutationFn: (data: FormLoginData) => loginWithEmailAndPassword(data),
		onSuccess: (data) => {
			setToken(data.data.token);
			saveUser(data.data.user);
			navigate(`${redirectTo ? `${redirectTo}` : paths.app.dashboard.getHref()}`, {
				replace: true,
			});
		},
		onError: (error: AxiosError) => {
			console.error(error.response?.data);
		},
	});
	function onSubmit(data: FormLoginData) {
		login.mutate(data);
	}
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			{...props}
			className='space-y-4'
		>
			<HookFormInput
				control={control}
				id='email'
				name='email'
				placeholder='Digite seu email'
				type='email'
				label='Email'
			/>
			<HookFormInput
				control={control}
				id='password'
				name='password'
				placeholder='Digite sua senha'
				type='password'
				label='Senha'
			/>
			<Link
				to={'/auth/forgot-password'}
				className='text-end w-full block text-sm'
			>
				Esqueceu a senha?
			</Link>
			{login.isError && (
				<p className='text-red-500 text-sm'>
					{(login.error as AxiosError<{ message: string }>)?.response?.data?.message ??
						'Erro ao fazer login. Tente novamente.'}
				</p>
			)}
			<Button
				type='submit'
				disabled={login.isPending}
				className='w-full cursor-pointer mt-2 mb-4 bg-[#1f7a6b] hover:bg-[#2fae8f] h-10 text-white'
			>
				{login.isPending ? <Spinner /> : 'Entrar'}
			</Button>
		</form>
	);
}
