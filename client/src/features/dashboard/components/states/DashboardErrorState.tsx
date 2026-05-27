import { CircleAlert, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type DashboardErrorStateProps = {
	message?: string;
	onRetry?: () => void;
	className?: string;
};

export default function DashboardErrorState({
	message = 'Erro ao carregar lançamentos',
	onRetry,
	className = 'h-62.5',
}: DashboardErrorStateProps) {
	return (
		<div className={`flex flex-col items-center justify-center px-4 text-center ${className}`}>
			<div className='mb-2.5 flex items-center justify-center rounded-full bg-red-300 p-3'>
				<CircleAlert className='text-red-600' />
			</div>
			<p className='text-red-700'>{message}</p>
			<p className='mb-2 text-xs text-red-500'>Tente novamente em alguns instantes.</p>
			{onRetry && (
				<Button
					className='cursor-pointer bg-red-600 text-white transition-colors hover:bg-red-500'
					onClick={onRetry}
				>
					<RefreshCcw />
					Recarregar
				</Button>
			)}
		</div>
	);
}
