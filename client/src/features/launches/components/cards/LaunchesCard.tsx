import { ArrowUpDown, Pencil, Trash } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Launch } from '../../types/launches.type';

type LaunchesCardProps = {
	data: Launch[];
};

function formatLaunchDate(value: string) {
	return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(value));
}

function formatLaunchValue(value: string) {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(Number(value));
}

export default function LaunchesCard({ data }: LaunchesCardProps) {
	const launches = Array.isArray(data) ? data : [];

	return (
		<Table className='flex-1 '>
			<TableCaption>Uma lista dos seus lançamentos recentes.</TableCaption>
			<TableHeader className='bg-card'>
				<TableRow className=''>
					<TableHead className='flex items-center gap-0.5'>
						DATA <ArrowUpDown className='size-3.5' />
					</TableHead>
					<TableHead>DESCRIÇÃO</TableHead>
					<TableHead>CATEGORIA</TableHead>
					<TableHead>TIPO</TableHead>
					<TableHead className='flex items-center gap-0.5'>
						VALOR <ArrowUpDown className='size-3.5' />
					</TableHead>
					<TableHead>AÇÕES</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{launches.map((launch) => {
					const isExpense = launch.type === 'EXPENSES';

					return (
						<TableRow key={launch.id}>
							<TableCell className='text-secondary-foreground'>{formatLaunchDate(launch.date)}</TableCell>
							<TableCell>{launch.description}</TableCell>
							<TableCell>{launch.categoryId}</TableCell>
							<TableCell className='py-3'>
								<span
									className={`inline-flex rounded-full w-24 py-1 justify-center ${
										isExpense ? 'bg-red-300 text-red-600' : 'bg-green-100 text-green-700'
									}`}
								>
									{isExpense ? 'Despesa' : 'Receita'}
								</span>
							</TableCell>
							<TableCell className={`${isExpense ? 'text-red-700' : 'text-green-700'} font-bold`}>
								{isExpense ? '-' : '+'}
								{formatLaunchValue(launch.value)}
							</TableCell>
							<TableCell className='space-x-2'>
								<Pencil className='size-3.5 inline' />
								<Trash className='size-3.5  inline' />
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
