'use client';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import { colorPallete } from '@/app/utils/colorspallete';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';

export default function Home() {
	const auth = useContext(authContext);
	console.log('auth', auth);

	return (
		<Stack
			sx={{
				display: 'grid',
				gridTemplateColumns: {
					xs: 'repeat(1, 1fr)',
					md: 'repeat(3, 1fr)',
				},
				minHeight: '100svh',
			}}>
			<Stack sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}></Stack>
			<Stack
				sx={{
					bgcolor: colorPallete['low-blue'],
					padding: 1,
				}}>
				<Typography sx={{ color: colorPallete.white }}>{auth.user?.email}</Typography>
				<Typography sx={{ color: colorPallete.white }}>{auth.user?.role}</Typography>
			</Stack>
		</Stack>
	);
}
