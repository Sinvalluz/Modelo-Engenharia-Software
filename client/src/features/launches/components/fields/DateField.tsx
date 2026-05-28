import { type Control, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { LaunchFormData } from '../../schemas/launch.schema';

interface DateFieldProps {
	control: Control<LaunchFormData>;
}

function getTodayDateInputValue() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export default function DateField({ control }: DateFieldProps) {
	return (
		<Controller
			control={control}
			name='date'
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>
						Data <span className='text-red-500'>*</span>
					</FieldLabel>
					<div className='flex items-center border rounded-xl max-h-14 px-2 flex-1 focus-within:ring-2 focus-within:ring-[#1f7a6b] focus-within:border-[#1f7a6b] transition-all'>
						<Input
							{...field}
							className='border-0 ring-0 focus-visible:ring-0 dark:bg-transparent h-14 dark:[&::-webkit-calendar-picker-indicator]:invert'
							type='date'
							max={getTodayDateInputValue()}
						/>
					</div>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
