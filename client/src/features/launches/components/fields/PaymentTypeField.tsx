import { type Control, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LaunchFormData } from '../../types/launches.type';

interface PaymentTypeFieldProps {
	control: Control<LaunchFormData>;
	launchType?: LaunchFormData['type'];
}

const paymentMethods = [
	{ value: 'DEPOSIT', label: 'Depósito' },
	{ value: 'DEBIT_CARD', label: 'Cartão de débito' },
	{ value: 'CREDIT_CARD', label: 'Cartão de crédito' },
	{ value: 'PIX', label: 'PIX' },
	{ value: 'TRANSFER', label: 'Transferência' },
];

const incomePaymentMethods = paymentMethods.filter((method) => ['DEPOSIT', 'PIX', 'TRANSFER'].includes(method.value));

export default function PaymentTypeField({ control, launchType }: PaymentTypeFieldProps) {
	const availablePaymentMethods = launchType === 'INCOME' ? incomePaymentMethods : paymentMethods;

	return (
		<Controller
			control={control}
			name='paymentMethod'
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>
						FORMA DE PAGAMENTO<span className='text-red-500'>*</span>
					</FieldLabel>
					<Select
						value={field.value}
						onValueChange={field.onChange}
					>
						<SelectTrigger className='min-h-14 dark:bg-transparent'>
							<SelectValue placeholder='Selecione...' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{availablePaymentMethods.map((method) => (
									<SelectItem
										key={method.value}
										value={method.value}
									>
										{method.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
