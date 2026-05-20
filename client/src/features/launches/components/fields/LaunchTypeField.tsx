import { TrendingDown, TrendingUp } from 'lucide-react';
import { type Control, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import type { LaunchFormData } from '../../types/launches.type';

interface LaunchTypeFieldProps {
	control: Control<LaunchFormData>;
}

export default function LaunchTypeField({ control }: LaunchTypeFieldProps) {
	return (
		<Controller
			control={control}
			name='type'
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>
						TIPO <span className='text-red-500'>*</span>
					</FieldLabel>
					<div className='flex gap-2.5'>
						<Button
							type='button'
							className={`cursor-pointer flex-1 text-secondary-foreground border border-secondary-foreground h-14 hover:bg-green-100 hover:border-green-400 ${field.value === 'INCOME' ? 'bg-green-100 border-green-400' : 'bg-transparent'}`}
							onClick={() => field.onChange('INCOME')}
						>
							<TrendingUp />
							Receita
						</Button>
						<Button
							type='button'
							className={`cursor-pointer flex-1 text-secondary-foreground border border-secondary-foreground h-14 hover:bg-red-100 hover:border-red-400 ${field.value === 'EXPENSES' ? 'bg-red-100 border-red-400' : 'bg-transparent'}`}
							onClick={() => field.onChange('EXPENSES')}
						>
							<TrendingDown />
							Despesa
						</Button>
					</div>

					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
