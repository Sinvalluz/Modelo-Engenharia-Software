import { type Control, Controller, useWatch } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { LaunchFormData } from '../../types/launches.type';
import { maskMoneyInput } from '../../utils/maskMoneyInput';

interface MoneyValueFieldProps {
	control: Control<LaunchFormData>;
}

export default function MoneyValueField({ control }: MoneyValueFieldProps) {
	const selectedType = useWatch({ control, name: 'type' });

	const focusColorClass =
		selectedType === 'INCOME'
			? 'focus-within:ring-green-600 focus-within:border-green-600'
			: selectedType === 'EXPENSES'
				? 'focus-within:ring-red-600 focus-within:border-red-600'
				: '';
	const currencyColorClass =
		selectedType === 'INCOME' ? 'text-green-600' : selectedType === 'EXPENSES' ? 'text-red-600' : '';

	return (
		<Controller
			control={control}
			name='value'
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>
						Valor <span className='text-red-500'>*</span>
					</FieldLabel>
					<div
						className={`flex items-center border rounded-xl h-14 px-4 flex-1 focus-within:ring-2 focus-within:ring-[#1f7a6b] focus-within:border-[#1f7a6b] transition-all ${focusColorClass}`}
					>
						<span className={`text-[18px] ${currencyColorClass}`}>R$</span>

						<Input
							{...field}
							type='text'
							min={0}
							onChange={(e) => {
								const masked = maskMoneyInput(e.target.value, field.value);
								field.onChange(masked);
							}}
							className='border-0 ring-0 focus-visible:ring-0 dark:bg-transparent h-14'
							placeholder='Digite o valor'
						/>
					</div>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
