import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { CircleCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useAuth } from '@/providers/AuthProvider';
import createLaunches from '../../services/createLaunches';
import { type LaunchFormData, launchFormSchema } from '../../types/launches.type';
import AccountTypeField from '../fields/AccountTypeField';
import CategoryField from '../fields/CategoryField';
import DateField from '../fields/DateField';
import DescriptionField from '../fields/DescriptionField';
import InstallmentsField from '../fields/InstallmentsField';
import LaunchTypeField from '../fields/LaunchTypeField';
import MoneyValueField from '../fields/MoneyValueField';
import PaymentTypeField from '../fields/PaymentTypeField';

export default function NewLaunchForm() {
	const { control, handleSubmit, reset, setValue } = useForm<LaunchFormData>({
		resolver: zodResolver(launchFormSchema),
		defaultValues: {
			type: undefined,
			value: '',
			date: '',
			categoryId: '',
			description: '',
			paymentMethod: '',
			AccountType: '',
			installments_quantity: '',
		},
	});
	const [installmentsEnabled, setInstallmentsEnabled] = useState(false);
	const [successDialogOpen, setSuccessDialogOpen] = useState(false);
	const selectedLaunchType = useWatch({ control, name: 'type' });
	const selectedPaymentMethod = useWatch({ control, name: 'paymentMethod' });
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { user } = useAuth();

	useEffect(() => {
		const incomePaymentMethods = ['DEPOSIT', 'PIX', 'TRANSFER'];

		if (
			selectedLaunchType === 'INCOME' &&
			selectedPaymentMethod &&
			!incomePaymentMethods.includes(selectedPaymentMethod)
		) {
			setValue('paymentMethod', '');
			setInstallmentsEnabled(false);
			setValue('installments_quantity', '');
		}
	}, [selectedLaunchType, selectedPaymentMethod, setValue]);

	useEffect(() => {
		if (selectedPaymentMethod !== 'CREDIT_CARD' && installmentsEnabled) {
			setInstallmentsEnabled(false);
			setValue('installments_quantity', '');
		}
	}, [installmentsEnabled, selectedPaymentMethod, setValue]);

	const launchQuery = useMutation({
		mutationFn: createLaunches,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['launches'] });
			reset();
			setInstallmentsEnabled(false);
			setSuccessDialogOpen(true);
		},
		onError: (error: AxiosError) => {
			console.error(error.response?.data);
		},
	});

	function onSubmit(data: LaunchFormData) {
		const value = Number(
			data.value
				.replace(/\./g, '')
				.replace(',', '.')
				.replace(/[^\d.-]/g, ''),
		);

		const payload = {
			userId: user!.id,
			type: data.type,
			value,
			date: data.date,
			categoryId: data.categoryId,
			description: data.description,
			paymentMethod: data.paymentMethod,
			account: data.AccountType,
			installmentsQuantity: Number(data.installments_quantity) || 1,
		};
		launchQuery.mutate(payload);
	}

	return (
		<Card className='flex-1 bg-transparent overflow-auto'>
			<CardContent>
				{launchQuery.isError && (
					<div className='text-red-500 text-sm mb-3'>
						{(launchQuery.error as AxiosError<{ message: string }>)?.response?.data?.message ??
							'Erro ao criar lançamento, tente novamente'}
					</div>
				)}
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<LaunchTypeField control={control} />
						<MoneyValueField control={control} />
						<div className='flex flex-col gap-5 lg:flex-row'>
							<DateField control={control} />
							<CategoryField control={control} />
						</div>

						<DescriptionField control={control} />
						<div className='flex flex-col gap-5 lg:flex-row'>
							<PaymentTypeField
								control={control}
								launchType={selectedLaunchType}
							/>
							<AccountTypeField control={control} />
						</div>

						{selectedPaymentMethod === 'CREDIT_CARD' && (
							<InstallmentsField
								control={control}
								enabled={installmentsEnabled}
								setEnabled={setInstallmentsEnabled}
								setValue={setValue}
							/>
						)}
						<div className='flex gap-2 items-center mt-2'>
							<span className='text-red-500'>*</span>
							<span className='text-secondary-foreground'>Campos obrigatórios</span>
						</div>
						<div className='flex justify-end gap-2 '>
							<Button
								type='button'
								className='h-10 cursor-pointer bg-transparent hover:bg-zinc-200 text-secondary-foreground border border-secondary-foreground dark:bg-white dark:hover:bg-zinc-300'
								onClick={() => {
									reset();
									setInstallmentsEnabled(false);
									navigate(paths.app.launches.getHref());
								}}
							>
								Cancelar
							</Button>
							<Button
								type='submit'
								disabled={launchQuery.isPending}
								className='cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f] h-10 text-white'
							>
								{launchQuery.isPending ? <Spinner /> : 'Salvar Lançamento'}
							</Button>
						</div>
					</FieldGroup>
				</form>
			</CardContent>
			<Dialog
				open={successDialogOpen}
				onOpenChange={setSuccessDialogOpen}
			>
				<DialogContent className='text-center sm:max-w-md'>
					<DialogHeader className='items-center'>
						<div className='flex size-14 items-center justify-center rounded-full bg-green-100 text-green-700'>
							<CircleCheck className='size-8' />
						</div>
						<DialogTitle>Lançamento salvo com sucesso!</DialogTitle>
						<DialogDescription>O saldo foi atualizado automaticamente.</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
