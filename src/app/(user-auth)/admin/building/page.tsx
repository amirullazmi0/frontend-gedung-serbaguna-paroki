'use client';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import { colorPallete } from '@/app/utils/colorspallete';
import { Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import BuildingTable from './components/BuildingTable';

export default function Home() {
	const auth = useContext(authContext);
	const navigation = useRouter();
	return (
		<Stack
			sx={{
				minHeight: '100svh',
				padding: 2,
			}}>
			<Stack alignItems={'flex-end'}>
				<Button
					variant='contained'
					onClick={() => navigation.push('/admin/building/add')}>
					Tambah Gedung
				</Button>
			</Stack>
			<BuildingTable />
		</Stack>
	);
}
