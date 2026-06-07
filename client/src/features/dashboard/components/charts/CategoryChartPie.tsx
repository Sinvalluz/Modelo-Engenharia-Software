import { useMemo, useState } from 'react';
import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardErrorState from '@/features/dashboard/components/states/DashboardErrorState';
import DashboardLoadingState from '@/features/dashboard/components/states/DashboardLoadingState';
import type { Launch, LaunchType } from '@/features/launches/types/launches.type';

type CategoryChartData = {
	categoryKey: string;
	categoryName: string;
	total: number;
	fill: string;
};

type CategoryChartPieProps = {
	launches: Launch[];
	isLoading: boolean;
	isError: boolean;
	onRetry?: () => void;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

const percentFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'percent',
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
});

const fallbackColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

const typeDescriptions: Record<LaunchType, string> = {
	EXPENSES: 'Distribuição das despesas por categoria',
	INCOME: 'Distribuição das entradas por categoria',
};

const emptyMessages: Record<LaunchType, string> = {
	EXPENSES: 'Nenhuma despesa encontrada.',
	INCOME: 'Nenhuma entrada encontrada.',
};

function buildCategoryChartData(launches: Launch[], selectedType: LaunchType) {
	const categories = new Map<string, CategoryChartData>();

	for (const launch of launches) {
		const value = Number(launch.value);

		if (launch.type !== selectedType || !launch.category || Number.isNaN(value)) continue;

		const categoryKey = launch.category.id;
		const currentCategory = categories.get(categoryKey);

		if (currentCategory) {
			currentCategory.total += value;
			continue;
		}

		categories.set(categoryKey, {
			categoryKey,
			categoryName: launch.category.name,
			total: value,
			fill: launch.category.color || fallbackColors[categories.size % fallbackColors.length],
		});
	}

	return Array.from(categories.values()).sort((firstCategory, secondCategory) => {
		return secondCategory.total - firstCategory.total;
	});
}

function buildChartConfig(chartData: CategoryChartData[]) {
	return chartData.reduce<ChartConfig>(
		(config, category) => ({
			...config,
			[category.categoryKey]: {
				label: category.categoryName,
			},
		}),
		{
			total: {
				label: 'Total',
			},
		},
	);
}

export function CategoryChartPie({ launches, isLoading, isError, onRetry }: CategoryChartPieProps) {
	const [selectedType, setSelectedType] = useState<LaunchType>('EXPENSES');
	const chartData = useMemo(() => buildCategoryChartData(launches, selectedType), [launches, selectedType]);
	const chartConfig = useMemo(() => buildChartConfig(chartData), [chartData]);
	const chartTotal = useMemo(() => chartData.reduce((total, category) => total + category.total, 0), [chartData]);

	return (
		<Card className='flex flex-col'>
			<CardHeader className='flex flex-col gap-3 pb-0 sm:flex-row sm:items-start sm:justify-between'>
				<div className='space-y-1 text-center sm:text-left'>
					<CardTitle>Categorias</CardTitle>
					<CardDescription>{typeDescriptions[selectedType]}</CardDescription>
				</div>
				<Select
					value={selectedType}
					onValueChange={(value) => setSelectedType(value as LaunchType)}
				>
					<SelectTrigger
						className='w-full sm:w-34'
						aria-label='Filtrar tipo de lançamento'
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent align='end'>
						<SelectItem value='EXPENSES'>Despesa</SelectItem>
						<SelectItem value='INCOME'>Entrada</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				{isLoading && <DashboardLoadingState rows={3} />}

				{isError && <DashboardErrorState onRetry={onRetry} />}

				{!isLoading && !isError && chartData.length === 0 && (
					<div className='flex h-62.5 items-center justify-center text-sm text-muted-foreground'>
						{emptyMessages[selectedType]}
					</div>
				)}

				{!isLoading && !isError && chartData.length > 0 && (
					<>
						<ChartContainer
							config={chartConfig}
							className='mx-auto aspect-square max-h-62.5'
						>
							<PieChart>
								<ChartTooltip
									cursor={false}
									content={
										<ChartTooltipContent
											hideLabel
											nameKey='categoryKey'
											formatter={(value, _name, item) => (
												<div className='flex min-w-32 items-center justify-between gap-3'>
													<span className='text-muted-foreground'>
														{item.payload?.categoryName}
													</span>
													<span className='font-mono font-medium text-foreground tabular-nums'>
														{currencyFormatter.format(Number(value))}
													</span>
												</div>
											)}
										/>
									}
								/>
								<Pie
									data={chartData}
									dataKey='total'
									nameKey='categoryKey'
								/>
							</PieChart>
						</ChartContainer>
						<div className='mt-4 grid gap-2 sm:grid-cols-2'>
							{chartData.map((category) => (
								<div
									key={category.categoryKey}
									className='flex items-center justify-between gap-3 text-sm'
								>
									<div className='flex min-w-0 items-center gap-2'>
										<span
											className='size-2.5 shrink-0 rounded-xs'
											style={{ backgroundColor: category.fill }}
										/>
										<span className='truncate text-muted-foreground'>{category.categoryName}</span>
									</div>
									<span className='shrink-0 font-medium tabular-nums'>
										{chartTotal > 0 ? percentFormatter.format(category.total / chartTotal) : '0,0%'}
									</span>
								</div>
							))}
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
