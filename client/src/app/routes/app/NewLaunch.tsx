import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import NewLaunchForm from '@/features/launches/components/forms/NewLaunchForm';

export default function NewLaunchRoute() {
	const navigate = useNavigate();
	return (
		<div className='p-4 sm:p-6 flex flex-col flex-1 space-y-4'>
			<div className='flex items-center gap-4'>
				<Button
					className='h-10 w-10 rounded-full p-0 bg-transparent text-foreground hover:bg-secondary  cursor-pointer'
					onClick={() => {
						navigate(paths.app.launches.getHref());
					}}
				>
					<ArrowLeft />
				</Button>

				<div>
					<h2 className='text-foreground font-bold text-xl'>Novo lançamento</h2>
					<span className='text-sm text-secondary-foreground'>Registre uma receita ou despesa</span>
				</div>
			</div>
			<NewLaunchForm />
		</div>
	);
}
