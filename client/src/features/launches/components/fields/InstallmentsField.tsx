import { type Control, Controller, type UseFormSetValue, useWatch } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { LaunchFormData } from '../../schemas/launch.schema';
import { formatInstallmentValue } from '../../utils/formatInstallmentValue';

interface InstallmentsFieldsProps {
	control: Control<LaunchFormData>;
	enabled: boolean;
	setEnabled: (enabled: boolean) => void;
	setValue: UseFormSetValue<LaunchFormData>;
}

export default function InstallmentsField({ control, enabled, setEnabled, setValue }: InstallmentsFieldsProps) {
	const selectedValue = useWatch({ control, name: 'value' });
	const selectedInstallmentsQuantity = useWatch({ control, name: 'installments_quantity' });
	const formattedInstallmentValue = formatInstallmentValue(selectedValue, selectedInstallmentsQuantity);

	return (
		<div className='space-y-3'>
			<div className='flex gap-4 items-center'>
				<FieldLabel>Parcelamento</FieldLabel>
				<Switch
					checked={enabled}
					onCheckedChange={(checked) => {
						setEnabled(checked);
						if (!checked) {
							setValue('installments_quantity', '');
						}
					}}
				/>
			</div>

			{enabled && (
				<div className='flex flex-col gap-5 lg:flex-row'>
					<Controller
						control={control}
						name='installments_quantity'
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Nº de parcelas</FieldLabel>
								<Select
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger className='min-h-14 w-full dark:bg-transparent'>
										<SelectValue placeholder='Selecione a quantidade de parcelas' />
									</SelectTrigger>
									<SelectContent className='h-60'>
										{Array.from({ length: 24 }, (_, i) => i + 1).map((value) => (
											<SelectItem
												key={value}
												value={String(value)}
											>
												{value}x
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Field>
						<FieldLabel>Valor por parcela</FieldLabel>
						<div className='flex items-center border rounded-xl h-14 px-4 flex-1 gap-2 text-[18px]'>
							<span>{formattedInstallmentValue}</span>
						</div>
					</Field>
				</div>
			)}
		</div>
	);
}
