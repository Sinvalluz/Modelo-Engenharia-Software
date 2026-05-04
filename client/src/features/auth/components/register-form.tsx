import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { registerWithEmailAndPassword } from '@/lib/api-client';
import { type FormRegisterData, FormRegisterDataSchema } from '@/types/user';
import HookFormInput from './hook-form-input';

interface RegisterFormProps extends React.ComponentProps<'form'> {}

export default function RegisterForm({ ...props }: RegisterFormProps) {
	const { handleSubmit, control } = useForm<FormRegisterData>({
		resolver: zodResolver(FormRegisterDataSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			monthlyIncome: '',
		},
	});

	const navigate = useNavigate();

	const registering = useMutation({
		mutationFn: (data: FormRegisterData) => registerWithEmailAndPassword(data),
		onSuccess: (data) => {
			console.log(data);
			navigate(paths.app.root.getHref());
		},
		onError: (error: AxiosError) => {
			console.error(error.response?.data);
		},
	});
	async function onSubmit(data: FormRegisterData) {
		registering.mutate(data);
	}
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			{...props}
			className='space-y-4'
		>
			<HookFormInput
				control={control}
				id='name'
				name='name'
				placeholder='Digite seu nome'
				type='text'
				label='Nome'
			/>
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
			<HookFormInput
				control={control}
				id='phoneNumber'
				name='phoneNumber'
				placeholder='(71) 99999-9999'
				type='text'
				label='Telefone'
			/>
			<HookFormInput
				control={control}
				id='monthlyIncome'
				name='monthlyIncome'
				placeholder='Digite seus ganhos mensais'
				type='text'
				label='Ganhos mensais'
			/>
			{registering.isError && (
				<p className='text-red-500 text-sm'>
					{(registering.error as AxiosError<{ message: string }>)?.response?.data?.message ??
						'Erro ao fazer login. Tente novamente.'}
				</p>
			)}
			<Button
				type='submit'
				disabled={registering.isPending}
				className='w-full cursor-pointer mt-4 mb-4 bg-[#1f7a6b] hover:bg-[#2fae8f] h-10 text-white'
			>
				{registering.isPending ? <Spinner /> : 'Comece agora'}
			</Button>
		</form>
	);
}
