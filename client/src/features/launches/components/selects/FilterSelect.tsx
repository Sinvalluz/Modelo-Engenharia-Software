import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

type Value = {
	id: number | string;
	item: string;
	value?: string;
};

interface FilterSelectProps {
	label: string;
	firstValueSelect: string;
	valuesSelects: Value[];
	value: string;
	onValueChange: (value: string) => void;
}

export default function FilterSelect({
	label,
	firstValueSelect,
	valuesSelects,
	value,
	onValueChange,
}: FilterSelectProps) {
	return (
		<div className='flex-1 space-y-2'>
			<Label htmlFor={label}>{label}</Label>
			<Select
				value={value}
				onValueChange={onValueChange}
			>
				<SelectTrigger
					className='h-12 w-full px-4 py-0'
					id={label}
				>
					<SelectValue placeholder={firstValueSelect} />
				</SelectTrigger>
				<SelectContent className='w-full'>
					<SelectGroup>
						<SelectLabel>{label}</SelectLabel>
						{valuesSelects.map((value) => (
							<SelectItem
								key={value.id}
								value={value.value ?? value.item}
							>
								{value.item}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
