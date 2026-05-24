import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { paths } from '@/config/paths';
import deleteLaunches from '../../services/deleteLaunches';
import type { Launch } from '../../types/launches.type';

type LaunchesCardProps = {
	data: Launch[];
};

type SortField = 'date' | 'value';
type SortDirection = 'asc' | 'desc';

function formatLaunchDate(value: string) {
	return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(value));
}

function formatLaunchValue(value: string) {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(Number(value));
}

function getLaunchTimestamp(value: string) {
	const timestamp = new Date(value).getTime();

	return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getLaunchSignedValue(launch: Launch) {
	const value = Number(launch.value);

	if (Number.isNaN(value)) return 0;

	return launch.type === 'EXPENSES' ? -value : value;
}

export default function LaunchesCard({ data }: LaunchesCardProps) {
	const launches = Array.isArray(data) ? data : [];
	const [sort, setSort] = useState<{ field: SortField; direction: SortDirection } | null>(null);
	const [launchToDelete, setLaunchToDelete] = useState<Launch | null>(null);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const deleteLaunchMutation = useMutation({
		mutationFn: deleteLaunches,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['launches'] });
			setLaunchToDelete(null);
		},
	});

	const sortedLaunches = useMemo(() => {
		if (!sort) return launches;

		return [...launches].sort((firstLaunch, secondLaunch) => {
			const firstValue =
				sort.field === 'date' ? getLaunchTimestamp(firstLaunch.date) : getLaunchSignedValue(firstLaunch);
			const secondValue =
				sort.field === 'date' ? getLaunchTimestamp(secondLaunch.date) : getLaunchSignedValue(secondLaunch);
			const result = firstValue - secondValue;

			return sort.direction === 'asc' ? result : -result;
		});
	}, [launches, sort]);

	function toggleSort(field: SortField) {
		setSort((currentSort) => {
			if (currentSort?.field !== field) {
				return { field, direction: 'asc' };
			}

			return {
				field,
				direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
			};
		});
	}

	function renderSortIcon(field: SortField) {
		if (sort?.field !== field) return <ArrowUpDown className='size-3.5' />;

		return sort.direction === 'asc' ? <ArrowUp className='size-3.5' /> : <ArrowDown className='size-3.5' />;
	}

	function getSortLabel(field: SortField) {
		if (sort?.field !== field) return 'none';

		return sort.direction === 'asc' ? 'ascending' : 'descending';
	}

	const selectedLaunchIsExpense = launchToDelete?.type === 'EXPENSES';

	return (
		<>
			<Table className='flex-1 '>
				<TableCaption>Uma lista dos seus lançamentos recentes.</TableCaption>
				<TableHeader className='bg-card'>
					<TableRow className=''>
						<TableHead
							className='w-20'
							aria-sort={getSortLabel('date')}
						>
							<button
								type='button'
								className='inline-flex h-full items-center gap-1 p-0 text-left font-medium text-inherit whitespace-nowrap bg-transparent cursor-pointer'
								onClick={() => toggleSort('date')}
							>
								DATA {renderSortIcon('date')}
							</button>
						</TableHead>
						<TableHead>DESCRIÇÃO</TableHead>
						<TableHead>CATEGORIA</TableHead>
						<TableHead>TIPO</TableHead>
						<TableHead
							className='w-24'
							aria-sort={getSortLabel('value')}
						>
							<button
								type='button'
								className='inline-flex h-full items-center gap-1 p-0 text-left font-medium text-inherit whitespace-nowrap bg-transparent cursor-pointer'
								onClick={() => toggleSort('value')}
							>
								VALOR {renderSortIcon('value')}
							</button>
						</TableHead>
						<TableHead>AÇÕES</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedLaunches.map((launch) => {
						const isExpense = launch.type === 'EXPENSES';

						return (
							<TableRow key={launch.id}>
								<TableCell className='text-secondary-foreground'>
									{formatLaunchDate(launch.date)}
								</TableCell>
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
								<TableCell>
									<div className='flex items-center gap-1'>
										<Button
											type='button'
											variant='ghost'
											size='icon-xs'
											className='cursor-pointer'
											aria-label={`Editar ${launch.description}`}
											onClick={() => navigate(paths.app.editLaunch.getHref(launch.id))}
										>
											<Pencil className='size-3.5' />
										</Button>
										<Button
											type='button'
											variant='ghost'
											size='icon-xs'
											className='cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700'
											aria-label={`Excluir ${launch.description}`}
											onClick={() => setLaunchToDelete(launch)}
										>
											<Trash className='size-3.5' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			<Dialog
				open={Boolean(launchToDelete)}
				onOpenChange={(open) => {
					if (!open && !deleteLaunchMutation.isPending) {
						setLaunchToDelete(null);
					}
				}}
			>
				<DialogContent
					showCloseButton={false}
					className='gap-5 rounded-2xl p-6 sm:max-w-96.25'
				>
					<DialogHeader className='flex-row items-start gap-3 space-y-0'>
						<div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600'>
							<Trash className='size-5' />
						</div>
						<div className='space-y-1 text-left'>
							<DialogTitle className='text-lg font-bold text-foreground'>Excluir lançamento?</DialogTitle>
							<DialogDescription className='text-sm text-slate-500'>
								Esta ação não pode ser desfeita.
							</DialogDescription>
						</div>
					</DialogHeader>

					{launchToDelete && (
						<div className='rounded-lg border border-secondary bg-secondary px-3 py-3 text-left'>
							<p className='font-semibold text-secondary-foreground'>{launchToDelete.description}</p>
							<p className='mt-1 text-sm text-foreground'>
								{selectedLaunchIsExpense ? '-' : '+'}
								{formatLaunchValue(launchToDelete.value)}
							</p>
						</div>
					)}

					{deleteLaunchMutation.isError && (
						<p className='text-sm text-red-600'>Erro ao excluir lançamento, tente novamente.</p>
					)}

					<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
						<Button
							type='button'
							variant='outline'
							className='h-10 cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
							disabled={deleteLaunchMutation.isPending}
							onClick={() => setLaunchToDelete(null)}
						>
							Cancelar
						</Button>
						<Button
							type='button'
							className='h-10 cursor-pointer bg-red-600 text-white hover:bg-red-700'
							disabled={!launchToDelete || deleteLaunchMutation.isPending}
							onClick={() => {
								if (launchToDelete) {
									deleteLaunchMutation.mutate(launchToDelete.id);
								}
							}}
						>
							{deleteLaunchMutation.isPending ? <Spinner /> : 'Confirmar exclusão'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
