'use client';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';

export default function Home() {
	const auth = useContext(authContext);

	return (
		<Stack
			sx={{
				minHeight: '100vh',
			}}></Stack>
	);
}
