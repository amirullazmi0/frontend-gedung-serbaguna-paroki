'use client';

import { useContext, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Stack, CircularProgress } from '@mui/material';

import { authContext } from '@/app/provider/auth-provider/authProvider';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { BuildingItemType } from '@/app/DTO/building';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import MapBuildingDetail from './components/MapBuildingDetail';
import BuildingDetail from './components/BuildingDetail';
import { colorPallete } from '@/app/utils/colorspallete';

export default function BuildingDetailPage() {
	const auth = useContext(authContext);
	const buildingId = useParams()['building-id'];

	const { data: buildingResponse, isLoading } = useQueryApiRequest<GlobalApiResponse<BuildingItemType>>({
		key: 'get-admin-building',
		withAuth: true,
		params: { id: buildingId },
	});

	useEffect(() => {
		console.log('Fetched building data:', buildingResponse);
	}, [buildingResponse]);

	if (isLoading) {
		return (
			<Stack
				minHeight='100vh'
				justifyContent='center'
				alignItems='center'>
				<CircularProgress />
			</Stack>
		);
	}

	if (!buildingResponse?.data) {
		return (
			<Stack
				minHeight='100vh'
				justifyContent='center'
				alignItems='center'>
				<Typography variant='h4'>Bangunan Tidak Ditemukan</Typography>
			</Stack>
		);
	}

	const building = buildingResponse.data;

	return (
		<Stack
			minHeight='100vh'
			bgcolor={colorPallete.white}
			sx={{
				display: 'grid',
				gridTemplateColumns: {
					xs: '1fr',
					md: '1fr 1fr',
				},
			}}>
			<Stack>
				<MapBuildingDetail
					lat={Number(building.buildingAddress[0].lat)}
					lng={Number(building.buildingAddress[0].lng)}
				/>
			</Stack>
			<Stack>
				{/* You can render more building detail here */}
				<BuildingDetail building={building} />
			</Stack>
		</Stack>
	);
}
