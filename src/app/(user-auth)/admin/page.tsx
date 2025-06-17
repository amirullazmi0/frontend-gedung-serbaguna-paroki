'use client';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';
import RentBuildingTable from './components/RentBuildingTable';

export default function Home() {
	const auth = useContext(authContext);

	return (
		<Stack
			sx={{
				minHeight: '100vh',
			}}>
			<RentBuildingTable />
		</Stack>
	);
}
