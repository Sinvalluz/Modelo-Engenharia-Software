import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { maskCurrency, maskName, maskPhone } from '@/utils/masks';

interface HookFormInputProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	id: string;
	placeholder?: string;
	label: string;
	type: React.HTMLInputTypeAttribute;
	mask?: 'phone' | 'currency' | 'name';
}

export default function HookFormInput<T extends FieldValues>({
	control,
	type,
	id,
	name,
	placeholder,
	label,
	mask,
}: HookFormInputProps<T>) {
	function applyMask(value: string, previousValue?: string) {
		switch (mask) {
			case 'phone':
				return maskPhone(value, previousValue);
			case 'currency':
				return maskCurrency(value, previousValue);
			case 'name':
				return maskName(value);
			default:
				return value;
		}
	}
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const isPassword = type === 'password';
	const inputType = isPassword && showPassword ? 'text' : type;
	const IconPassword = showPassword ? Eye : EyeClosed;
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={id}>{label}</FieldLabel>
					<div className='relative'>
						<Input
							id={id}
							{...field}
							aria-invalid={fieldState.invalid}
							placeholder={placeholder}
							className='h-10 focus-visible:ring-[#1f7a6b]'
							autoComplete='off'
							onChange={(e) => {
								const masked = applyMask(e.target.value, field.value);
								field.onChange(masked);
							}}
							type={inputType}
						/>
						{isPassword && (
							<IconPassword
								className='absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer'
								width={18}
								onClick={() => setShowPassword(!showPassword)}
								onMouseDown={(e) => e.preventDefault()}
							/>
						)}
					</div>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
