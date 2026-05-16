import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterCard from '@/features/launches/components/FilterCard';

export default function LaunchesRoute() {
	return (
		<div className='p-10 flex-1'>
			<div className='flex flex-col items-start md:flex-row md:items-center md:justify-between mb-3'>
				<div>
					<h2 className='text-foreground font-bold text-xl'>Lançamentos</h2>
					<span className='text-sm text-secondary-foreground'>20 Registros encontrados</span>
				</div>
				<Button className='cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f] text-white h-12 px-6 flex items-center mt-3'>
					<Plus className='size-5' />
					<span className='leading-none'>Novo Lançamento</span>
				</Button>
			</div>
			<FilterCard />
		</div>
	);
}
