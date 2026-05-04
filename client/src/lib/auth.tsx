import { useQuery } from '@tanstack/react-query';
import { Navigate, useLocation } from 'react-router';
import { paths } from '@/config/paths';
import { useAuth } from '@/context/AuthContext';
import { fetchMe } from './api-client';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { user, saveUser } = useAuth();
	const location = useLocation();

	const token = localStorage.getItem('token');
	const userId = localStorage.getItem('userId');

	const { isLoading, isError } = useQuery({
		queryKey: ['me', userId],
		queryFn: async () => {
			if (!token || !userId) {
				throw new Error('No token or userId');
			}
			const response = await fetchMe(token, userId);
			saveUser(response.data);
			return response.data;
		},
		enabled: !!token && !!userId,
		staleTime: 1000 * 60 * 5,
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !user) {
		return (
			<Navigate
				to={paths.auth.login.getHref(location.pathname)}
				replace
			/>
		);
	}

	return children;
};
