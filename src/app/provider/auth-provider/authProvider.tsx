'use client';

import { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { useAuth } from '@/app/hook/auth/useAuth';
import { useRouter } from 'next/navigation';

// Mendefinisikan tipe data User
interface User {
	email: string;
	role: 'USER' | 'ADMIN' | 'SUPERADMIN'; // Tipe Role sesuai kebutuhan Anda
}

// Tipe data AuthContext
type AuthContextType = {
	user: User | null;
	authenticated: boolean;
	logout: () => Promise<void>;
};

// Membuat context auth untuk aplikasi
export const authContext = createContext<AuthContextType>({
	user: null,
	authenticated: false,
	logout: async () => {},
});

// Provider untuk AuthContext
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [authenticated, setAuthenticated] = useState<boolean>(false);
	const router = useRouter();
	const checkAuth = async () => {
		const response = await useAuth();
		if (response.authenticated && response.email && response.role) {
			setUser({
				email: response.email,
				role: response.role,
			});
			setAuthenticated(true);
		} else {
			setUser(null);
			setAuthenticated(false);
		}
	};

	const logout = async () => {
		Cookies.remove('access-token');
		setAuthenticated(false);
		setUser(null);
		router.refresh();
	};

	useEffect(() => {
		checkAuth();
	}, []);

	return <authContext.Provider value={{ user, authenticated, logout }}>{children}</authContext.Provider>;
};
