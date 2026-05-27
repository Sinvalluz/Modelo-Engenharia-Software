import { Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function EmptyCategoriesCard() {
	return (
		<Card className='flex-1 flex items-center justify-center'>
			<CardContent className='flex flex-col items-center'>
				<div className='p-3 bg-[#1f7a6b] rounded-full mb-2.5'>
					<Tag className='text-white' />
				</div>

				<p className='text-foreground'>Nenhuma categoria ainda</p>
				<p className='text-secondary-foreground text-center'>
					Crie sua primeira categoria para organizar seus lançamentos.
				</p>
			</CardContent>
		</Card>
	);
}
