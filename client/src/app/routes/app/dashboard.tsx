import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/api-client';

export default function DashboardRoute() {
	const { user, setUser } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return (
		<div>
			<h1>Bem vindo a sua futura dashboard</h1>
			<p>Olá, {user?.name}!</p>

			<Button
				className='cursor-pointer'
				onClick={async () => {
					try {
						await logout();
						queryClient.clear();
						navigate(paths.auth.login.getHref());
						setUser(null);
					} catch (e) {
						console.error('Erro ao deslogar', e);
					}
				}}
			>
				Sair
			</Button>
		</div>
	);
}
