import { AuthProvider } from './AuthProvider';
import QueryProvider from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<QueryProvider>
			<AuthProvider>
				<ThemeProvider
					defaultTheme='light'
					storageKey='vite-ui-theme'
				>
					{children}
				</ThemeProvider>
			</AuthProvider>
		</QueryProvider>
	);
}
