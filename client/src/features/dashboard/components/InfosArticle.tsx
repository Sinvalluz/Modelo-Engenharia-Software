import { TrendingDown, TrendingUp, WalletCards } from 'lucide-react';
import { useMemo } from 'react';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Launch } from '@/features/launches/types/launches.type';

type DashboardTotals = {
	balance: number;
	income: number;
	expenses: number;
};

type InfosArticleProps = {
	launches: Launch[];
	previousLaunches: Launch[];
	balanceLaunches: Launch[];
	isLoading: boolean;
	isError: boolean;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

function getDashboardTotals(launches: Launch[]): DashboardTotals {
	return launches.reduce<DashboardTotals>(
		(totals, launch) => {
			const value = Number(launch.value);

			if (Number.isNaN(value)) return totals;

			if (launch.type === 'INCOME') {
				return {
					...totals,
					balance: totals.balance + value,
					income: totals.income + value,
				};
			}

			if (launch.type === 'EXPENSES') {
				return {
					...totals,
					balance: totals.balance - value,
					expenses: totals.expenses + value,
				};
			}

			return totals;
		},
		{
			balance: 0,
			income: 0,
			expenses: 0,
		},
	);
}

function formatCurrency(value: number) {
	return currencyFormatter.format(value);
}

function getStatusText(isLoading: boolean, isError: boolean) {
	if (isLoading) return 'Carregando lançamentos...';
	if (isError) return 'Erro ao atualizar';

	return 'Atualizado agora';
}

function formatMonthlyComparison(currentValue: number, previousValue: number) {
	const percentage =
		previousValue === 0
			? currentValue === 0
				? 0
				: 100
			: ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
	const roundedPercentage = Math.round(percentage);
	const sign = roundedPercentage > 0 ? '+' : '';

	return `${sign}${roundedPercentage}% vs mês anterior`;
}

export default function InfosArticle({
	launches,
	previousLaunches,
	balanceLaunches,
	isLoading,
	isError,
}: InfosArticleProps) {
	const totals = useMemo(() => getDashboardTotals(launches), [launches]);
	const previousTotals = useMemo(() => getDashboardTotals(previousLaunches), [previousLaunches]);
	const balanceTotals = useMemo(() => getDashboardTotals(balanceLaunches), [balanceLaunches]);
	const statusText = getStatusText(isLoading, isError);
	const incomeComparisonText =
		isLoading || isError ? statusText : formatMonthlyComparison(totals.income, previousTotals.income);
	const expensesComparisonText =
		isLoading || isError ? statusText : formatMonthlyComparison(totals.expenses, previousTotals.expenses);

	return (
		<section className='mt-7 grid grid-cols-1 gap-4 lg:grid-cols-3'>
			<Card className='min-h-36.5 border-[#051310] bg-[#051310] px-1 py-7 text-white shadow-[0_2px_5px_rgba(16,25,45,0.25)]'>
				<CardHeader className='px-4'>
					<CardTitle className='text-sm font-medium text-[#d9e7ff]'>Saldo atual</CardTitle>
					<CardAction className='flex size-8 items-center justify-center rounded-lg bg-white/12 text-slate-200'>
						<WalletCards className='size-4' />
					</CardAction>
				</CardHeader>

				<CardContent className='px-4'>
					<p className='text-3xl font-bold tracking-normal text-white'>
						{formatCurrency(balanceTotals.balance)}
					</p>
					<p className='mt-2 text-xs text-[#b7c9e8]'>
						{isLoading || isError ? statusText : 'Acumulado até o mês selecionado'}
					</p>
				</CardContent>
			</Card>

			<Card className='min-h-36.5 px-1 py-7 shadow-[0_2px_5px_rgba(15,23,42,0.14)]'>
				<CardHeader className='px-4'>
					<CardTitle className='text-sm font-medium text-[#466184] dark:text-secondary-foreground'>
						Total receitas
					</CardTitle>
					<CardAction className='flex size-8 items-center justify-center rounded-lg bg-[#d8f8e4] text-[#00b949]'>
						<TrendingUp className='size-4' />
					</CardAction>
				</CardHeader>

				<CardContent className='px-4'>
					<p className='text-3xl font-bold tracking-normal text-[#00a83f]'>{formatCurrency(totals.income)}</p>
					<p className='mt-2 text-xs text-[#00a83f]'>{incomeComparisonText}</p>
				</CardContent>
			</Card>

			<Card className='min-h-36.5 px-1 py-7 shadow-[0_2px_5px_rgba(15,23,42,0.14)]'>
				<CardHeader className='px-4'>
					<CardTitle className='text-sm font-medium text-[#466184] dark:text-secondary-foreground'>
						Total despesas
					</CardTitle>
					<CardAction className='flex size-8 items-center justify-center rounded-lg bg-[#ffe2e6] text-[#f00019]'>
						<TrendingDown className='size-4' />
					</CardAction>
				</CardHeader>

				<CardContent className='px-4'>
					<p className='text-3xl font-bold tracking-normal text-[#f00019]'>
						{formatCurrency(totals.expenses)}
					</p>
					<p className='mt-2 text-xs text-[#f00019]'>{expensesComparisonText}</p>
				</CardContent>
			</Card>
		</section>
	);
}
