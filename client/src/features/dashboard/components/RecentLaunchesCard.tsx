import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { paths } from '@/config/paths';
import DashboardErrorState from '@/features/dashboard/components/states/DashboardErrorState';
import DashboardLoadingState from '@/features/dashboard/components/states/DashboardLoadingState';
import type { Launch } from '@/features/launches/types/launches.type';

type RecentLaunchesCardProps = {
	launches: Launch[];
	isLoading: boolean;
	isError: boolean;
	onRetry?: () => void;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
	day: '2-digit',
	month: '2-digit',
	timeZone: 'UTC',
});

function getLaunchTimestamp(value: string) {
	const timestamp = new Date(value).getTime();

	return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatLaunchValue(launch: Launch) {
	const sign = launch.type === 'EXPENSES' ? '-' : '+';

	return `${sign}${currencyFormatter.format(Number(launch.value))}`;
}

function getRecentLaunches(launches: Launch[]) {
	return [...launches]
		.sort(
			(firstLaunch, secondLaunch) => getLaunchTimestamp(secondLaunch.date) - getLaunchTimestamp(firstLaunch.date),
		)
		.slice(0, 5);
}

export default function RecentLaunchesCard({ launches, isLoading, isError, onRetry }: RecentLaunchesCardProps) {
	const recentLaunches = useMemo(() => getRecentLaunches(launches), [launches]);

	return (
		<Card>
			<CardHeader className='grid-cols-[1fr_auto] items-center border-b pb-4'>
				<CardTitle className='text-base font-bold text-foreground'>Últimos lançamentos</CardTitle>
				<Link
					to={paths.app.launches.getHref()}
					className='text-sm font-medium text-primary hover:underline'
				>
					Ver todos →
				</Link>
			</CardHeader>
			<CardContent className='px-0'>
				{isLoading && (
					<DashboardLoadingState
						className='h-40'
						rows={3}
					/>
				)}

				{isError && (
					<DashboardErrorState
						className='h-40'
						onRetry={onRetry}
					/>
				)}

				{!isLoading && !isError && recentLaunches.length === 0 && (
					<div className='flex h-40 items-center justify-center px-4 text-sm text-muted-foreground'>
						Nenhum lançamento encontrado.
					</div>
				)}

				{!isLoading && !isError && recentLaunches.length > 0 && (
					<div className='divide-y divide-border/60'>
						{recentLaunches.map((launch) => {
							const isExpense = launch.type === 'EXPENSES';

							return (
								<div
									key={launch.id}
									className='grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 py-4'
								>
									<div
										className={`flex size-9 items-center justify-center rounded-lg ${
											isExpense ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
										}`}
									>
										{isExpense ? (
											<ArrowDownLeft className='size-4' />
										) : (
											<ArrowUpRight className='size-4' />
										)}
									</div>

									<div className='min-w-0'>
										<p className='truncate font-semibold text-foreground'>{launch.description}</p>
										<div className='mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground'>
											<span
												className='size-2 shrink-0 rounded-full'
												style={{ backgroundColor: launch.category.color }}
											/>
											<span className='truncate'>{launch.category.name}</span>
											<span>·</span>
											<span>{dateFormatter.format(new Date(launch.date))}</span>
										</div>
									</div>

									<div className='text-right'>
										<p className={`font-bold ${isExpense ? 'text-red-600' : 'text-green-700'}`}>
											{formatLaunchValue(launch)}
										</p>
										<span
											className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
												isExpense ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
											}`}
										>
											{isExpense ? 'Despesa' : 'Receita'}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
