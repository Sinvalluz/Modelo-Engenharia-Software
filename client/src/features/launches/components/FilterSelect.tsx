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
	id: number;
	item: string;
};

interface FilterSelectProps {
	label: string;
	firstValueSelect: string;
	valuesSelects: Value[];
}

export default function FilterSelect({ label, firstValueSelect, valuesSelects }: FilterSelectProps) {
	return (
		<div className='flex-1 space-y-2'>
			<Label>{label}</Label>
			<Select>
				<SelectTrigger className='w-full p-4'>
					<SelectValue placeholder={firstValueSelect} />
				</SelectTrigger>
				<SelectContent className='w-full'>
					<SelectGroup>
						<SelectLabel>{label}</SelectLabel>
						{valuesSelects.map((value) => (
							<SelectItem
								key={value.id}
								value={value.item}
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
