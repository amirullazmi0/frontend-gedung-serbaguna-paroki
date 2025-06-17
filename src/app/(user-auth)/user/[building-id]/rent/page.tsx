'use client';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import { colorPallete } from '@/app/utils/colorspallete';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';
import FormRentBuilding from './components/FormRentBuilding';

export default function Home() {
	return (
		<Stack
			sx={{
				display: 'grid',

				minHeight: '100svh',
			}}>
			<FormRentBuilding />
		</Stack>
	);
}
