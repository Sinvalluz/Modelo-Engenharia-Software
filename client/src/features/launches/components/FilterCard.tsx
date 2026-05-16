import { ListFilter, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import FilterSelect from './FilterSelect';

const periodos = [
	{ id: 1, item: 'Maio 2026' },
	{ id: 2, item: 'Abril 2026' },
	{ id: 3, item: 'Março 2026' },
	{ id: 4, item: 'Fevereiro 2026' },
	{ id: 5, item: 'Janeiro 2026' },
];

const categories = [
	{ id: 1, item: 'Tecnologia' },
	{ id: 2, item: 'Esportes' },
	{ id: 3, item: 'Educação' },
	{ id: 4, item: 'Saúde' },
	{ id: 5, item: 'Entretenimento' },
];

const tipos = [
	{ id: 1, item: 'Receita' },
	{ id: 2, item: 'Despesa' },
];

export default function FilterCard() {
	const [hiddenFilters, setHiddenFilters] = useState(false);
	return (
		<Card className='p-6'>
			<div className='flex items-center gap-2 h-12'>
				<div className='flex items-center border rounded-xl h-full px-4 flex-1 focus-within:ring-2 focus-within:ring-[#1f7a6b] focus-within:border-[#1f7a6b] transition-all'>
					<Search />
					<Input
						className='border-0 ring-0 focus-visible:ring-0 dark:bg-transparent'
						placeholder='Buscar por descrição...'
					/>
				</div>
				<Button
					className='h-full cursor-pointer flex items-center'
					onClick={() => setHiddenFilters(!hiddenFilters)}
				>
					<ListFilter />
					<span>Filtros</span>
				</Button>
			</div>
			<div className={`flex flex-col md:flex-row gap-4 ${hiddenFilters ? 'hidden' : 'block'}`}>
				<FilterSelect
					label='Período'
					firstValueSelect='Maio 2026'
					valuesSelects={periodos}
				/>
				<FilterSelect
					firstValueSelect='Todas'
					label='Categorias'
					valuesSelects={categories}
				/>
				<FilterSelect
					firstValueSelect='Todos'
					label='Tipo'
					valuesSelects={tipos}
				/>
			</div>
		</Card>
	);
}
