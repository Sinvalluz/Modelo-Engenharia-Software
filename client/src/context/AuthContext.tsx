import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import type { User } from '@/types/user';

export interface AuthContextType {
	user: User | null;
	loading: boolean;
	saveUser: (userData: User) => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const stored = localStorage.getItem('user');
		if (stored) {
			setUser(JSON.parse(stored) as User);
		}
		setLoading(false);
	}, []);

	const saveUser = (userData: User): void => {
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
	};

	const logout = (): void => {
		setUser(null);
		localStorage.removeItem('user');
	};

	return <AuthContext.Provider value={{ user, saveUser, logout, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
	}
	return context;
}
