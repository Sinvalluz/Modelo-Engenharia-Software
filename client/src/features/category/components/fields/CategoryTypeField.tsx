import { type Control, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CategoryFormData } from '../../schemas/category.schema';

interface LaunchTypeFieldProps {
	control: Control<CategoryFormData>;
}

export default function CategoryTypeField({ control }: LaunchTypeFieldProps) {
	return (
		<Controller
			control={control}
			name='type'
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>
						TIPO <span className='text-red-500'>*</span>
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
								<SelectItem value='EXPENSES'>Despesa</SelectItem>
								<SelectItem value='INCOME'>Receita</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>

					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
