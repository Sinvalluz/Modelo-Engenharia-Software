import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useAuth } from '@/context/AuthContext';

export default function DashboardRoute() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	return (
		<div>
			<h1>Bem vindo a sua futura dashboard</h1>
			<p>{user?.name}</p>
			<Button
				className='cursor-pointer'
				onClick={() => {
					logout();
					navigate(paths.auth.login.getHref());
				}}
			>
				Sair
			</Button>
		</div>
	);
}
