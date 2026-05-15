import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { queryConfig } from '@/lib/react-query';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: queryConfig,
			}),
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
