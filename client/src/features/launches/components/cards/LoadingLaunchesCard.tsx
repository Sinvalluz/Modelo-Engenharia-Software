import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

export default function LoadingLaunchesCard() {
	return (
		<Card className='flex-1'>
			<CardContent className='space-y-4'>
				<div className='flex items-center gap-1.5'>
					<Spinner />
					<span>Carregando lançamentos...</span>
				</div>
				<div className='flex w-full gap-2'>
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
				</div>
				<div className='flex w-full gap-2'>
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
				</div>
				<div className='flex w-full gap-2'>
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
				</div>
				<div className='flex w-full gap-2'>
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
				</div>
				<div className='flex w-full gap-2'>
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
					<Skeleton className='h-5  flex-1 rounded' />
				</div>
			</CardContent>
		</Card>
	);
}
