'use client';
import DashboardCalendar from '@/app/components/DashboardCalendar';
import { buildingItemType, buildingsDummy } from '@/app/DTO/building';
import { colorPallete } from '@/app/utils/colorspallete';
import { Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Section = () => {
	const buildingId = useParams()['building-id'];
	const [building, setBuilding] = useState<buildingItemType>();
	// const building = buildingsDummy.find(b => b.id == Number(buildingId));

	useEffect(() => {
		const getData = buildingsDummy.find(b => b.id == Number(buildingId));
		setBuilding(getData);

		console.log('building', building);
	}, [buildingId]);
	return (
		<Stack
			sx={{
				display: 'grid',
				gridTemplateColumns: {
					xs: 'repeat(1, 1fr)',
					md: 'repeat(4, 1fr)',
				},
				minHeight: '100svh',
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
				<DashboardCalendar />
			</Stack>
			<Stack
				sx={{
					padding: 2,
					bgcolor: colorPallete.white,
					boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.25)',
					height: '100%', // full height as well
					overflowY: 'auto',
				}}>
				<Typography variant='h4'>{building?.name}</Typography>
				<Typography>{building?.description}</Typography>
			</Stack>
		</Stack>
	);
};

export default Section;
