import { TableOfContents } from 'lucide-react';
import NewLaunchButton from '@/components/NewLaunchButton';
import { Card, CardContent } from '@/components/ui/card';

export default function EmptyLaunchesCard() {
	return (
		<Card className='flex-1 flex items-center justify-center'>
			<CardContent className='flex flex-col items-center'>
				<div className='p-3 bg-[#1f7a6b] rounded-full mb-2.5'>
					<TableOfContents className='text-white' />
				</div>

				<p className='text-foreground'>Nenhum lançamento ainda</p>
				<p className='text-secondary-foreground text-center'>Adicione seu primeiro lançamento para começar.</p>
				<NewLaunchButton />
			</CardContent>
		</Card>
	);
}
