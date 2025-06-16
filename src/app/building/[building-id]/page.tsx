'use client';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { BuildingItemType } from '@/app/DTO/building';
import { colorPallete } from '@/app/utils/colorspallete';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { useParams } from 'next/navigation';
import BuildingCalendar from './components/BuildingCalendar';
import BuildingDetailGlobal from './components/BuildingDetailGlobal';

export default function Home() {
	const buildingId = useParams()['building-id'];
	const { data } = useQueryApiRequest<GlobalApiResponse<BuildingItemType>>({
		key: 'get-building',
		withAuth: false,
		params: {
			id: buildingId,
		},
	});

	const building = data?.data;
	return (
		<Stack>
			<Stack
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: 'repeat(1, 1fr)',
						md: 'repeat(4, 1fr)',
					},
					minHeight: '100svh',
					bgcolor: `#f8f9fa`,
				}}>
				<Stack
					gridColumn={{
						xs: 'span 1',
						md: 'span 3',
					}}
					sx={{
						height: '100%',
						overflowY: 'auto',
						padding: 2,
					}}>
					<BuildingCalendar />
				</Stack>
				<BuildingDetailGlobal building={building} />
			</Stack>
		</Stack>
	);
}
