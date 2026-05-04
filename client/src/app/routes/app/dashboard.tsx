import { useAuth } from '@/context/AuthContext';

export default function DashboardRoute() {
	const { user } = useAuth();
	return (
		<div>
			<h1>Bem vindo a sua futura dashboard</h1>
			<p>{user?.name}</p>
		</div>
	);
}
