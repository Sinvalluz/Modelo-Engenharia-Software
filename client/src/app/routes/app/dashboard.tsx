import NewLaunchButton from '@/components/NewLaunchButton';
import InfosArticle from '@/features/dashboard/components/InfosArticle';

export default function DashboardRoute() {
	return (
		<div className='flex-1 min-w-0 p-4 sm:p-5'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<div>
					<h1 className='text-[20px] font-bold leading-6 text-foreground'>Dashboard</h1>
					<p className='mt-1 text-sm text-[#466184] dark:text-secondary-foreground'>
						Resumo financeiro — Abril 2026
					</p>
				</div>

				<NewLaunchButton />
			</div>
			<InfosArticle />
		</div>
	);
}
