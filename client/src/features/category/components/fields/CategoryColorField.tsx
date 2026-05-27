import { type Control, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { CategoryFormData } from '../../schemas/category.schema';

interface CategoryColorFieldProps {
	control: Control<CategoryFormData>;
}

export default function CategoryColorField({ control }: CategoryColorFieldProps) {
	return (
		<Controller
			control={control}
			name='color'
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>
						Cor <span className='text-red-500'>*</span>
					</FieldLabel>

					<Input
						{...field}
						type='color'
						value={field.value || '#000000'}
						onChange={(event) => field.onChange(event.target.value.toUpperCase())}
						className='focus-visible:ring-[#1f7a6b] dark:bg-transparent h-14 p-2'
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
