'use client';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';
import FormEditBuilding from './components/FormEditBuilding';

export default function Home() {
	const auth = useContext(authContext);
	console.log('auth', auth);

	return (
		<Stack
			sx={{
				minHeight: '100vh',
			}}>
			<FormEditBuilding />
		</Stack>
	);
}
