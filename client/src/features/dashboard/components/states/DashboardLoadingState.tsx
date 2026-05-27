import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

type DashboardLoadingStateProps = {
	message?: string;
	rows?: number;
	className?: string;
};

export default function DashboardLoadingState({
	message = 'Carregando lançamentos...',
	rows = 4,
	className = 'h-62.5',
}: DashboardLoadingStateProps) {
	return (
		<div className={`flex flex-col justify-center gap-4 ${className}`}>
			<div className='flex items-center justify-center gap-1.5 text-sm text-muted-foreground'>
				<Spinner />
				<span>{message}</span>
			</div>
			<div className='space-y-2 px-4'>
				{Array.from({ length: rows }, (_, index) => (
					<div
						key={`dashboard-loading-row-${index}`}
						className='flex w-full gap-2'
					>
						<Skeleton className='h-5 flex-1 rounded' />
						<Skeleton className='h-5 flex-1 rounded' />
						<Skeleton className='h-5 flex-1 rounded' />
					</div>
				))}
			</div>
		</div>
	);
}
