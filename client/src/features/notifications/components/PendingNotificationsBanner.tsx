import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BellRing, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import listPendingNotifications from '../services/listPendingNotifications';
import markNotificationAsRead from '../services/markNotificationAsRead';

function formatNotificationDate(value: string) {
	return new Intl.DateTimeFormat('pt-BR', {
		dateStyle: 'short',
		timeStyle: 'short',
	}).format(new Date(value));
}

export default function PendingNotificationsBanner() {
	const queryClient = useQueryClient();
	const notificationsQuery = useQuery({
		queryKey: ['notifications', 'pending'],
		queryFn: listPendingNotifications,
		refetchInterval: 60_000,
	});
	const markAsReadMutation = useMutation({
		mutationFn: markNotificationAsRead,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['notifications', 'pending'] });
		},
	});
	const notifications = notificationsQuery.data?.data ?? [];

	if (notifications.length === 0) return null;

	return (
		<section className='p-4 pb-0 sm:p-5 sm:pb-0'>
			<div className='rounded-lg border border-[#2fae8f]/30 bg-[#2fae8f]/10 p-3 text-sm text-foreground'>
				<div className='flex items-start gap-3'>
					<div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#1f7a6b] text-white'>
						<BellRing className='size-4' />
					</div>
					<div className='min-w-0 flex-1 space-y-2'>
						<div>
							<h2 className='font-semibold'>Notificacoes pendentes</h2>
							<p className='text-secondary-foreground'>
								{notifications.length === 1
									? 'Voce tem 1 lembrete para registrar suas movimentacoes.'
									: `Voce tem ${notifications.length} lembretes para registrar suas movimentacoes.`}
							</p>
						</div>
						<div className='grid gap-2'>
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className='flex flex-col gap-2 rounded-lg bg-background p-3 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between'
								>
									<div className='min-w-0'>
										<p className='font-medium'>{notification.title}</p>
										<p className='text-secondary-foreground'>{notification.message}</p>
										<p className='mt-1 text-xs text-secondary-foreground'>
											Gerada em {formatNotificationDate(notification.createdAt)}
										</p>
									</div>
									<Button
										type='button'
										variant='outline'
										className='h-9 cursor-pointer'
										disabled={markAsReadMutation.isPending}
										onClick={() => markAsReadMutation.mutate(notification.id)}
									>
										<Check className='size-4' />
										<span>Marcar como lida</span>
									</Button>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
