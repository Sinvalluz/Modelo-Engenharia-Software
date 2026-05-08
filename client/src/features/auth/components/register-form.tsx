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
			phoneNumber: '',
			monthlyIncome: '',
		},
	});

	const navigate = useNavigate();

	const registering = useMutation({
		mutationFn: registerWithEmailAndPassword,
		onSuccess: () => {
			navigate(paths.auth.login.getHref());
		},
		onError: (error: AxiosError) => {
			console.error(error.response?.data);
		},
	});

	function normalizePhone(value?: string): string | undefined {
		if (!value) return undefined;
		return value.replace(/^\((\d{2})\)\s/, '+55 $1 ');
	}

	function normalizeMonthlyIncome(value?: string): number | undefined {
		if (!value || value.trim() === '') return undefined;

		const clean = value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();

		const parsed = Number(clean);
		return Number.isNaN(parsed) ? undefined : parsed;
	}
	async function onSubmit(data: FormRegisterData) {
		const payload = {
			...data,
			phoneNumber: normalizePhone(data.phoneNumber),
			monthlyIncome: normalizeMonthlyIncome(data.monthlyIncome),
		};

		console.log(payload.monthlyIncome);
		registering.mutate(payload);
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
				mask='name'
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
				label='Telefone (Opcional)'
				mask='phone'
			/>
			<HookFormInput
				control={control}
				id='monthlyIncome'
				name='monthlyIncome'
				mask='currency'
				placeholder='Digite seus ganhos mensais'
				type='text'
				label='Ganhos mensais (Opcional)'
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
