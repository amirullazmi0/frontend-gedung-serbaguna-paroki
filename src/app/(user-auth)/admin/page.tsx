'use client';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import { colorPallete } from '@/app/utils/colorspallete';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';
import Section from './Section';

export default function Home() {
	const auth = useContext(authContext);

	return (
		<Stack
			sx={{
				minHeight: '100vh',
			}}>
			<Stack sx={{ gridColumn: { xs: 'span 1', md: 'span 2' }, padding: 1 }}>
				<Section />
			</Stack>
		</Stack>
	);
}
