import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

const skeletonRows = ['row-1', 'row-2', 'row-3', 'row-4', 'row-5'];

export default function LoadingCategoriesCard() {
	return (
		<Card className='flex-1'>
			<CardContent className='space-y-4'>
				<div className='flex items-center gap-1.5'>
					<Spinner />
					<span>Carregando categorias...</span>
				</div>
				{skeletonRows.map((row) => (
					<div
						key={row}
						className='flex w-full gap-2'
					>
						<Skeleton className='h-5 flex-1 rounded' />
						<Skeleton className='h-5 flex-1 rounded' />
						<Skeleton className='h-5 flex-1 rounded' />
						<Skeleton className='h-5 flex-1 rounded' />
					</div>
				))}
			</CardContent>
		</Card>
	);
}
