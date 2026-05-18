import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import AppLayout from '@/components/layouts/AppLayout';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { fetchMe } from '@/lib/api-client';
import { useAuth } from '@/providers/AuthProvider';

export default function LayoutRoute({ children }: { children: React.ReactNode }) {
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
	return (
		<div className='h-screen box-border w-full flex flex-col md:flex-row'>
			<AppLayout />
			{children}
		</div>
	);
}
