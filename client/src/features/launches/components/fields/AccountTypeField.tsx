import { type Control, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LaunchFormData } from '../../types/launches.type';

interface AccountTypeFieldProps {
	control: Control<LaunchFormData>;
}

const accountTypes = [
	{ value: 'CURRENT', label: 'Conta corrente' },
	{ value: 'SAVINGS', label: 'Poupança' },
];

export default function AccountTypeField({ control }: AccountTypeFieldProps) {
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
					>
						<SelectTrigger className='min-h-14 dark:bg-transparent'>
							<SelectValue placeholder='Selecione...' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{accountTypes.map((account) => (
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
