import { type Control, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LaunchFormData } from '../../schemas/launch.schema';

interface AccountTypeFieldProps {
	control: Control<LaunchFormData>;
	disabled?: boolean;
	showWallet?: boolean;
}

export default function AccountTypeField({ control, disabled = false, showWallet = false }: AccountTypeFieldProps) {
	// Realizar logica dps para puxar tipos de contas da api
	const accountTypes = [
		{ value: 'CURRENT', label: 'Conta corrente' },
		{ value: 'SAVINGS', label: 'Poupança' },
	];

	const availableAccountTypes = showWallet
		? [...accountTypes, { value: 'WALLET', label: 'Carteira' }]
		: accountTypes;

	return (
		<Controller
			control={control}
			name='AccountType'
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>
						CONTA<span className='text-red-500'>*</span>
					</FieldLabel>
					<Select
						value={field.value}
						onValueChange={field.onChange}
						disabled={disabled}
					>
						<SelectTrigger className='min-h-14 dark:bg-transparent'>
							<SelectValue placeholder='Selecione...' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{availableAccountTypes.map((account) => (
									<SelectItem
										key={account.value}
										value={account.value}
									>
										{account.label}
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
