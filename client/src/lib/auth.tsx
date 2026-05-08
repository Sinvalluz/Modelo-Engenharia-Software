import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useAuth } from '@/context/AuthContext';
import { fetchMe } from './api-client';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { setUser } = useAuth();
	const location = useLocation();

	const { data, isLoading, isError, isSuccess } = useQuery({
		queryKey: ['user'],
		queryFn: fetchMe,
		retry: false,
	});

	useEffect(() => {
		if (isSuccess) {
			setUser(data.data);
		}
	}, [isSuccess, data?.data, setUser]);

	if (isLoading) return <Spinner />;

	if (isError) {
		return (
			<Navigate
				to={paths.auth.login.getHref(location.pathname)}
				replace
			/>
		);
	}

	return children;
};
