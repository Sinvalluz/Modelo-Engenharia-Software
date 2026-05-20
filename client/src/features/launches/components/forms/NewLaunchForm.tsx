import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { paths } from '@/config/paths';
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
	const selectedLaunchType = useWatch({ control, name: 'type' });
	const selectedPaymentMethod = useWatch({ control, name: 'paymentMethod' });
	const navigate = useNavigate();

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

	function onSubmit(data: LaunchFormData) {
		const normalizedData = {
			...data,
			installments_quantity: data.installments_quantity || '1',
		};

		console.log(normalizedData);
		reset();
		navigate(paths.app.launches.getHref());
	}

	return (
		<Card className='flex-1 bg-transparent overflow-auto'>
			<CardContent>
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
								// disabled={login.isPending}
								className='cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f] h-10 text-white'
							>
								{/* {login.isPending ? <Spinner /> : 'Entrar'} */}
								Salvar Lançamento
							</Button>
						</div>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
