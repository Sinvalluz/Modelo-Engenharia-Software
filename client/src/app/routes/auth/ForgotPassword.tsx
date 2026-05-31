import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import HookFormInput from '@/features/auth/components/hook-form-input';
import { requestPasswordReset } from '@/lib/api-client';
import { type FormForgotPasswordData, FormForgotPasswordDataSchema } from '@/types/user';

export default function ForgotPasswordRoute() {
	const { handleSubmit, control } = useForm<FormForgotPasswordData>({
		resolver: zodResolver(FormForgotPasswordDataSchema),
		defaultValues: {
			email: '',
		},
	});

	const forgotPassword = useMutation({
		mutationFn: requestPasswordReset,
	});

	function onSubmit(data: FormForgotPasswordData) {
		forgotPassword.mutate(data);
	}

	const successMessage =
		forgotPassword.data?.data.message ??
		'Se o email informado estiver cadastrado, voce recebera as instruções de recuperação.';

	return (
		<div className='h-lvh flex items-center justify-center bg-background text-foreground lg:p-4 select-none'>
			<div className='p-4 h-full flex flex-col rounded-2xl lg:w-1/2'>
				<div className='flex flex-col justify-center items-center'>
					<div className='lg:max-w-96'>
						<div className='self-start mb-7'>
							<img
								src='/icone-marca.svg'
								alt=''
								width={50}
							/>
						</div>
						<div className='mb-12'>
							<h1 className='text-4xl font-semibold'>Recuperar senha</h1>
							<p className='sm:text-xl'>
								Informe o email cadastrado para receber as instruções de recuperação da sua conta.
							</p>
						</div>
						<form
							onSubmit={handleSubmit(onSubmit)}
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
							{forgotPassword.isSuccess && <p className='text-sm text-[#1f7a6b]'>{successMessage}</p>}
							{forgotPassword.isError && (
								<p className='text-destructive text-sm'>
									{(forgotPassword.error as AxiosError<{ message: string }>)?.response?.data?.message ??
										'Erro ao solicitar recuperação de senha. Tente novamente.'}
								</p>
							)}
							<Button
								type='submit'
								disabled={forgotPassword.isPending}
								className='w-full cursor-pointer mt-2 mb-4 bg-[#1f7a6b] hover:bg-[#2fae8f] h-10 text-white'
							>
								{forgotPassword.isPending ? <Spinner /> : 'Enviar'}
							</Button>
						</form>
						<Link
							to={paths.auth.login.getHref()}
							className='inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
						>
							<ArrowLeft size={16} />
							Voltar para o login
						</Link>
					</div>
				</div>
			</div>
			<div
				className='hidden min-h-full w-1/2 lg:flex flex-col justify-between p-9 bg-cover bg-center box-border rounded-2xl'
				style={{ backgroundImage: "url('/mesh-276.png')" }}
			>
				<h1 className='text-4xl font-bold text-white self-end'>Siscodep</h1>
				<div className='text-end'>
					<p className='text-white text-xl'>Volte a acessar sua conta.</p>
					<h2 className='text-2xl font-bold text-white'>
						Recupere seu acesso com segurança e continue acompanhando seus gastos, ganhos e metas em um só lugar.
					</h2>
				</div>
			</div>
		</div>
	);
}
