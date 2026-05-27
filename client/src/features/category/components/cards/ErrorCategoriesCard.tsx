import { CircleAlert, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ErrorCategoriesCardProps = {
	onRetry: () => void;
};

export default function ErrorCategoriesCard({ onRetry }: ErrorCategoriesCardProps) {
	return (
		<Card className='flex-1 flex items-center justify-center'>
			<CardContent className='flex flex-col items-center'>
				<div className='p-3 bg-red-300 rounded-full mb-2.5 flex items-center justify-center'>
					<CircleAlert className='text-red-600' />
				</div>

				<p className='text-red-700'>Erro ao carregar categorias</p>
				<p className='text-red-500 text-center text-xs mb-2'>Tente novamente em alguns instantes.</p>
				<Button
					className='bg-red-600 hover:bg-red-500 transition-colors text-white cursor-pointer'
					onClick={onRetry}
				>
					<RefreshCcw />
					Recarregar
				</Button>
			</CardContent>
		</Card>
	);
}
