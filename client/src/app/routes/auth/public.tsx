import { useQuery } from '@tanstack/react-query';
import { Navigate, useLocation } from 'react-router';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { fetchMe } from '@/lib/api-client';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const redirectTo = location.state?.redirectTo ?? paths.app.dashboard.getHref();

	const { isLoading, isSuccess } = useQuery({
		queryKey: ['user'],
		queryFn: fetchMe,
		retry: false,
	});

	if (isLoading) return <Spinner />;

	if (isSuccess) {
		return (
			<Navigate
				to={redirectTo}
				replace
			/>
		);
	}

	return children;
}
