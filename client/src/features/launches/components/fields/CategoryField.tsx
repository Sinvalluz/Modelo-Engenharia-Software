import { useQuery } from '@tanstack/react-query';
import { type Control, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import findAllCategories from '@/lib/findAllCategories';
import type { LaunchFormData } from '../../schemas/launch.schema';

interface CategoryFieldProps {
	control: Control<LaunchFormData>;
}

export default function CategoryField({ control }: CategoryFieldProps) {
	const { data } = useQuery({
		queryKey: ['categories'],
		queryFn: findAllCategories,
		retry: false,
	});
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
								{data?.data.map((category) => (
									<SelectItem
										key={category.id}
										value={category.id}
									>
										{category.name}
									</SelectItem>
								))}
								<SelectItem value='teste'>teste</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
