import { TrendingDown, TrendingUp, WalletCards } from 'lucide-react';

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InfosArticle() {
	return (
		<section className='mt-7 grid grid-cols-1 gap-4 md:grid-cols-3'>
			<Card className='min-h-36.5 border-[#051310] bg-[#051310] px-1 py-7 text-white shadow-[0_2px_5px_rgba(16,25,45,0.25)]'>
				<CardHeader className='px-4'>
					<CardTitle className='text-sm font-medium text-[#d9e7ff]'>Saldo atual</CardTitle>
					<CardAction className='flex size-8 items-center justify-center rounded-lg bg-white/12 text-slate-200'>
						<WalletCards className='size-4' />
					</CardAction>
				</CardHeader>

				<CardContent className='px-4'>
					<p className='text-3xl font-bold tracking-normal text-white'>R$ 2.340,00</p>
					<p className='mt-2 text-xs text-[#b7c9e8]'>Atualizado agora</p>
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
					<p className='text-3xl font-bold tracking-normal text-[#00a83f]'>R$ 5.800,00</p>
					<p className='mt-2 text-xs text-[#00a83f]'>+12% vs mês anterior</p>
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
					<p className='text-3xl font-bold tracking-normal text-[#f00019]'>R$ 3.460,00</p>
					<p className='mt-2 text-xs text-[#f00019]'>-5% vs mês anterior</p>
				</CardContent>
			</Card>
		</section>
	);
}
