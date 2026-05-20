import NewLaunchButton from '@/components/NewLaunchButton';
import LaunchesCard from '@/features/launches/components/cards/LaunchesCard';
import FilterCard from '@/features/launches/components/forms/FilterForm';

export default function LaunchesRoute() {
	return (
		<div className='p-4 sm:p-6 flex flex-col flex-1 space-y-4'>
			<div className='flex flex-col items-start md:flex-row md:items-center md:justify-between mb-3'>
				<div>
					<h2 className='text-foreground font-bold text-xl'>Lançamentos</h2>
					<span className='text-sm text-secondary-foreground'>20 Registros encontrados</span>
				</div>
				<NewLaunchButton />
			</div>
			<FilterCard />
			<LaunchesCard />
		</div>
	);
}
