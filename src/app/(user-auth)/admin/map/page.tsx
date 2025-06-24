'use client';
import Stack from '@mui/material/Stack';
import dynamic from 'next/dynamic';

const MapBuilding = dynamic(() => import('./components/MapBuilding'), { ssr: false });

export default function Home() {
	return (
		<Stack
			sx={{
				minHeight: '100svh',
			}}>
			<Stack>
				<MapBuilding />
			</Stack>
		</Stack>
	);
}
