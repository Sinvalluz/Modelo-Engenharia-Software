import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import DashboardErrorState from '@/features/dashboard/components/states/DashboardErrorState';
import DashboardLoadingState from '@/features/dashboard/components/states/DashboardLoadingState';
import type { Launch } from '@/features/launches/types/launches.type';

type ChartLineMultipleProps = {
	launches: Launch[];
	isLoading: boolean;
	isError: boolean;
	onRetry?: () => void;
};

type MonthlyChartData = {
	monthKey: string;
	monthLabel: string;
	income: number;
	expenses: number;
};

const chartConfig = {
	income: {
		label: 'Receitas',
		color: '#00a83f',
	},
	expenses: {
		label: 'Despesas',
		color: '#f00019',
	},
} satisfies ChartConfig;

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
	month: 'short',
	year: '2-digit',
	timeZone: 'UTC',
});

function getMonthKey(date: string) {
	return date.slice(0, 7);
}

function getMonthLabel(monthKey: string) {
	const [year, month] = monthKey.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, 1));

	return monthFormatter.format(date).replace('.', '');
}

function addMonth(monthKey: string) {
	const [year, month] = monthKey.split('-').map(Number);
	const date = new Date(Date.UTC(year, month, 1));

	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function buildMonthRange(monthKeys: string[]) {
	if (monthKeys.length === 0) return [];

	const sortedMonthKeys = [...monthKeys].sort();
	const firstMonth = sortedMonthKeys[0];
	const lastMonth = sortedMonthKeys[sortedMonthKeys.length - 1];
	const months: string[] = [];

	for (let monthKey = firstMonth; monthKey <= lastMonth; monthKey = addMonth(monthKey)) {
		months.push(monthKey);
	}

	return months;
}

function buildMonthlyChartData(launches: Launch[]) {
	const months = new Map<string, MonthlyChartData>();

	for (const launch of launches) {
		const value = Number(launch.value);
		const monthKey = getMonthKey(launch.date);

		if (!monthKey || Number.isNaN(value)) continue;

		const currentMonth = months.get(monthKey) ?? {
			monthKey,
			monthLabel: getMonthLabel(monthKey),
			income: 0,
			expenses: 0,
		};

		if (launch.type === 'INCOME') {
			currentMonth.income += value;
		}

		if (launch.type === 'EXPENSES') {
			currentMonth.expenses += value;
		}

		months.set(monthKey, currentMonth);
	}

	return buildMonthRange(Array.from(months.keys())).map((monthKey) => {
		return (
			months.get(monthKey) ?? {
				monthKey,
				monthLabel: getMonthLabel(monthKey),
				income: 0,
				expenses: 0,
			}
		);
	});
}

export function ChartLineMultiple({ launches, isLoading, isError, onRetry }: ChartLineMultipleProps) {
	const chartData = useMemo(() => buildMonthlyChartData(launches), [launches]);

	return (
		<Card className='flex min-w-0 flex-1 flex-col'>
			<CardHeader>
				<CardTitle>Receitas e despesas</CardTitle>
				<CardDescription>Variação mensal dos lançamentos</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading && <DashboardLoadingState className='h-80' />}

				{isError && (
					<DashboardErrorState
						className='h-80'
						onRetry={onRetry}
					/>
				)}

				{!isLoading && !isError && chartData.length === 0 && (
					<div className='flex h-80 items-center justify-center text-sm text-muted-foreground'>
						Nenhum lançamento encontrado.
					</div>
				)}

				{!isLoading && !isError && chartData.length > 0 && (
					<ChartContainer
						config={chartConfig}
						className='h-80 w-full'
					>
						<LineChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey='monthLabel'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => currencyFormatter.format(Number(value)).replace(',00', '')}
								width={76}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										formatter={(value, name) => (
											<div className='flex min-w-36 items-center justify-between gap-3'>
												<span className='text-muted-foreground'>
													{chartConfig[name as keyof typeof chartConfig]?.label ?? name}
												</span>
												<span className='font-mono font-medium text-foreground tabular-nums'>
													{currencyFormatter.format(Number(value))}
												</span>
											</div>
										)}
									/>
								}
							/>
							<Line
								dataKey='income'
								type='monotone'
								stroke='var(--color-income)'
								strokeWidth={2}
								dot={false}
							/>
							<Line
								dataKey='expenses'
								type='monotone'
								stroke='var(--color-expenses)'
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
