import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
	children: React.ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: queryConfig,
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ThemeProvider
					defaultTheme='light'
					storageKey='vite-ui-theme'
				>
					{children}
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}
