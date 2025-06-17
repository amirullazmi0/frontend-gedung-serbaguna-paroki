'use client';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import { colorPallete } from '@/app/utils/colorspallete';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';
import RentBuildingTable from './components/RentBuildingTable';

export default function Home() {
	const auth = useContext(authContext);
	console.log('auth', auth);

	return (
		<Stack
			sx={{
				minHeight: '100svh',
			}}>
			<RentBuildingTable />
		</Stack>
	);
}
