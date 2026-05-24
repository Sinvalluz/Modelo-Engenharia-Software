import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import EditLaunchForm from '@/features/launches/components/forms/EditLaunchForm';
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

export default function EditLaunchRoute() {
	const navigate = useNavigate();
	const { launchId } = useParams();
	const launchQuery = useQuery({
		queryKey: ['launches'],
		queryFn: listAllLaunches,
	});
	const launches = getLaunches(launchQuery.data?.data);
	const launch = useMemo(() => launches.find((item) => item.id === launchId), [launchId, launches]);

	return (
		<div className='p-4 sm:p-6 flex flex-col flex-1 space-y-4'>
			<div className='flex items-center gap-4'>
				<Button
					className='h-10 w-10 rounded-full p-0 bg-transparent text-foreground hover:bg-secondary cursor-pointer'
					onClick={() => {
						navigate(paths.app.launches.getHref());
					}}
				>
					<ArrowLeft />
				</Button>

				<div>
					<h2 className='text-foreground font-bold text-xl'>Editar lançamento</h2>
					<span className='text-sm text-secondary-foreground'>Atualize os dados da receita ou despesa</span>
				</div>
			</div>

			{launchQuery.isLoading && (
				<div className='flex min-h-60 items-center justify-center'>
					<Spinner />
				</div>
			)}
			{launchQuery.isError && (
				<div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
					Erro ao carregar lançamento para edição.
				</div>
			)}
			{launchQuery.isSuccess &&
				(launch ? (
					<EditLaunchForm launch={launch} />
				) : (
					<div className='rounded-xl border p-4 text-sm text-secondary-foreground'>
						Lançamento não encontrado.
					</div>
				))}
		</div>
	);
}
