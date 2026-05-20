import { type Control, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LaunchFormData } from '../../types/launches.type';

interface CategoryFieldProps {
	control: Control<LaunchFormData>;
}

// Fazer requisição na api
const categoryOptions = ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4', 'Categoria 5', 'Categoria 6'];

export default function CategoryField({ control }: CategoryFieldProps) {
	return (
		<Controller
			control={control}
			name='categoryId'
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>
						Categoria <span className='text-red-500'>*</span>
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
								{categoryOptions.map((category) => (
									<SelectItem
										key={category}
										value={category}
									>
										{category}
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
