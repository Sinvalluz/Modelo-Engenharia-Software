import { ListFilter, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import FilterSelect from '../selects/FilterSelect';

const tipos = [
	{ id: 'all', item: 'Todos', value: 'all' },
	{ id: 'income', item: 'Receita', value: 'INCOME' },
	{ id: 'expenses', item: 'Despesa', value: 'EXPENSES' },
];

type FilterOption = {
	id: number | string;
	item: string;
	value?: string;
};

export type LaunchFilters = {
	search: string;
	period: string;
	category: string;
	type: string;
};

type FilterCardProps = {
	filters: LaunchFilters;
	periods: FilterOption[];
	categories: FilterOption[];
	onFiltersChange: (filters: LaunchFilters) => void;
};

export default function FilterCard({ filters, periods, categories, onFiltersChange }: FilterCardProps) {
	const [showFilters, setShowFilters] = useState(false);
	const updateFilter = (key: keyof LaunchFilters, value: string) => {
		onFiltersChange({ ...filters, [key]: value });
	};

	return (
		<Card className='p-6'>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]'>
				<div className='flex h-12 min-w-0 items-center border rounded-xl px-4 focus-within:ring-2 focus-within:ring-[#1f7a6b] focus-within:border-[#1f7a6b] transition-all'>
					<Search />
					<Input
						className='border-0 ring-0 focus-visible:ring-0 dark:bg-transparent'
						id='filterInput'
						placeholder='Buscar por descrição...'
						value={filters.search}
						onChange={(event) => updateFilter('search', event.target.value)}
					/>
				</div>
				<Button
					className='h-12 cursor-pointer flex items-center justify-center whitespace-nowrap sm:shrink-0'
					onClick={() => setShowFilters(!showFilters)}
				>
					<ListFilter />
					<span>Filtros</span>
				</Button>
			</div>
			<div className={`mt-4 mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 ${showFilters ? '' : 'hidden'}`}>
				<FilterSelect
					label='Período'
					firstValueSelect='Todos'
					valuesSelects={periods}
					value={filters.period}
					onValueChange={(value) => updateFilter('period', value)}
				/>
				<FilterSelect
					firstValueSelect='Todas'
					label='Categorias'
					valuesSelects={categories}
					value={filters.category}
					onValueChange={(value) => updateFilter('category', value)}
				/>
				<FilterSelect
					firstValueSelect='Todos'
					label='Tipo'
					valuesSelects={tipos}
					value={filters.type}
					onValueChange={(value) => updateFilter('type', value)}
				/>
			</div>
		</Card>
	);
}
