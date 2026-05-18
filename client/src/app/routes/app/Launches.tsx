import NewLaunchButton from '@/components/NewLaunchButton';
import LaunchesEmptyCards from '@/features/launches/components/EmptyLaunchesCard';
import ErrorLaunchesCard from '@/features/launches/components/ErrorLaunchesCard';
import FilterCard from '@/features/launches/components/FilterCard';
import LoadingLaunchesCard from '@/features/launches/components/LoadingLaunchesCard';

export default function LaunchesRoute() {
	return (
		<div className='p-10 flex flex-col flex-1 space-y-4'>
			<div className='flex flex-col items-start md:flex-row md:items-center md:justify-between mb-3'>
				<div>
					<h2 className='text-foreground font-bold text-xl'>Lançamentos</h2>
					<span className='text-sm text-secondary-foreground'>20 Registros encontrados</span>
				</div>
				<NewLaunchButton />
			</div>
			<FilterCard />
			<LaunchesEmptyCards />
		</div>
	);
}
