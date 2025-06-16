'use client';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import { colorPallete } from '@/app/utils/colorspallete';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';
import MapBuilding from './components/MapBuilding';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { BuildingItemType } from '@/app/DTO/building';

export default function Home() {
	const auth = useContext(authContext);
	const { data: buildingResponse } = useQueryApiRequest<GlobalApiResponse<BuildingItemType[]>>({
		key: 'get-admin-building',
		withAuth: true,
	});

	const buildings = buildingResponse?.data;

	return (
		<Stack
			sx={{
				minHeight: '100svh',
			}}>
			<Stack>
				<MapBuilding building={buildings} />
			</Stack>
		</Stack>
	);
}
