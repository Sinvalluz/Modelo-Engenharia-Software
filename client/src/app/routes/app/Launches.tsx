import { useQuery } from '@tanstack/react-query';
import NewLaunchButton from '@/components/NewLaunchButton';
import EmptyLaunchesCard from '@/features/launches/components/cards/EmptyLaunchesCard';
import ErrorLaunchesCard from '@/features/launches/components/cards/ErrorLaunchesCard';
import LaunchesCard from '@/features/launches/components/cards/LaunchesCard';
import LoadingLaunchesCard from '@/features/launches/components/cards/LoadingLaunchesCard';
import FilterCard from '@/features/launches/components/forms/FilterForm';
import listAllLaunches from '@/features/launches/services/listAllLaunches';
import type { Launch } from '@/features/launches/types/launches.type';

function getLaunches(data: unknown): Launch[] {
	if (Array.isArray(data)) return data;

	if (data && typeof data === 'object') {
		const responseData = data as {
			data?: unknown;
			launches?: unknown;
			transactions?: unknown;
		};

		if (Array.isArray(responseData.data)) return responseData.data;
		if (Array.isArray(responseData.launches)) return responseData.launches;
		if (Array.isArray(responseData.transactions)) return responseData.transactions;
	}

	return [];
}

export default function LaunchesRoute() {
	const launchQuery = useQuery({
		queryKey: ['launches'],
		queryFn: listAllLaunches,
	});
	const launches = getLaunches(launchQuery.data?.data);

	return (
		<div className='p-4 sm:p-6 flex flex-col flex-1 space-y-4'>
			<div className='flex flex-col items-start md:flex-row md:items-center md:justify-between mb-3'>
				<div>
					<h2 className='text-foreground font-bold text-xl'>Lançamentos</h2>
					<span className='text-sm text-secondary-foreground'>
						{launches.length} Registros encontrados
					</span>
				</div>
				<NewLaunchButton />
			</div>
			<FilterCard />
			{launchQuery.isLoading && <LoadingLaunchesCard />}
			{launchQuery.isError && <ErrorLaunchesCard />}
			{launchQuery.isSuccess && (launches.length === 0 ? <EmptyLaunchesCard /> : <LaunchesCard data={launches} />)}
		</div>
	);
}
