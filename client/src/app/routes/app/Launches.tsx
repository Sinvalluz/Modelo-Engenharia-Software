import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import NewLaunchButton from '@/components/NewLaunchButton';
import EmptyLaunchesCard from '@/features/launches/components/cards/EmptyLaunchesCard';
import ErrorLaunchesCard from '@/features/launches/components/cards/ErrorLaunchesCard';
import LaunchesCard from '@/features/launches/components/cards/LaunchesCard';
import LoadingLaunchesCard from '@/features/launches/components/cards/LoadingLaunchesCard';
import FilterCard, { type LaunchFilters } from '@/features/launches/components/forms/FilterForm';
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

function getMonthKey(date: string) {
	return date.slice(0, 7);
}

function formatMonthYear(date: string) {
	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) return date;

	return new Intl.DateTimeFormat('pt-BR', {
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(parsedDate);
}

function compareLaunchDateDesc(firstLaunch: Launch, secondLaunch: Launch) {
	return new Date(secondLaunch.date).getTime() - new Date(firstLaunch.date).getTime();
}

export default function LaunchesRoute() {
	const [filters, setFilters] = useState<LaunchFilters>({
		search: '',
		period: 'all',
		category: 'all',
		type: 'all',
	});
	const launchQuery = useQuery({
		queryKey: ['launches'],
		queryFn: listAllLaunches,
	});
	const launches = getLaunches(launchQuery.data?.data);
	const sortedLaunches = useMemo(() => [...launches].sort(compareLaunchDateDesc), [launches]);
	const periodOptions = useMemo(() => {
		const periods = new Map<string, string>();

		for (const launch of sortedLaunches) {
			const monthKey = getMonthKey(launch.date);

			if (!periods.has(monthKey)) {
				periods.set(monthKey, formatMonthYear(launch.date));
			}
		}

		return [
			{ id: 'all', item: 'Todos', value: 'all' },
			...Array.from(periods, ([value, item]) => ({ id: value, item, value })),
		];
	}, [sortedLaunches]);
	const categoryOptions = useMemo(() => {
		const categories = new Set(sortedLaunches.map((launch) => launch.categoryId).filter(Boolean));

		return [
			{ id: 'all', item: 'Todas', value: 'all' },
			...Array.from(categories, (category) => ({ id: category, item: category, value: category })),
		];
	}, [sortedLaunches]);
	const filteredLaunches = useMemo(() => {
		const normalizedSearch = filters.search.trim().toLocaleLowerCase('pt-BR');

		return sortedLaunches.filter((launch) => {
			const matchesSearch =
				normalizedSearch.length === 0 ||
				launch.description.toLocaleLowerCase('pt-BR').includes(normalizedSearch);
			const matchesPeriod = filters.period === 'all' || getMonthKey(launch.date) === filters.period;
			const matchesCategory = filters.category === 'all' || launch.categoryId === filters.category;
			const matchesType = filters.type === 'all' || launch.type === filters.type;

			return matchesSearch && matchesPeriod && matchesCategory && matchesType;
		});
	}, [filters, sortedLaunches]);

	return (
		<div className='p-4 sm:p-6 flex flex-col flex-1 min-w-0 space-y-4'>
			<div className='flex flex-col items-start md:flex-row md:items-center md:justify-between mb-3'>
				<div>
					<h2 className='text-foreground font-bold text-xl'>Lançamentos</h2>
					<span className='text-sm text-secondary-foreground'>
						{filteredLaunches.length === 1
							? `${filteredLaunches.length} Registro encontrado`
							: `${filteredLaunches.length} Registros encontrados`}
					</span>
				</div>
				<NewLaunchButton />
			</div>
			<FilterCard
				filters={filters}
				periods={periodOptions}
				categories={categoryOptions}
				onFiltersChange={setFilters}
			/>
			{launchQuery.isLoading && <LoadingLaunchesCard />}
			{launchQuery.isError && <ErrorLaunchesCard />}
			{launchQuery.isSuccess &&
				(filteredLaunches.length === 0 ? <EmptyLaunchesCard /> : <LaunchesCard data={filteredLaunches} />)}
		</div>
	);
}
