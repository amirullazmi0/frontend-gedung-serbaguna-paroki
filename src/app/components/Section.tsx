import { Stack } from '@mui/material';
import React from 'react';
import DashboardCalendar from './DashboardCalendar';
import { colorPallete } from '../utils/colorspallete';
import DashboardMap from './DashboardMap';

const Section = () => {
	return (
		<Stack
			sx={{
				display: 'grid',
				gridTemplateColumns: {
					xs: 'repeat(1, 1fr)',
					md: 'repeat(4, 1fr)',
				},
			}}>
			<Stack
				gridColumn={{
					xs: 'span 1',
					md: 'span 4',
				}}
				sx={{
					height: '100%', // Make this Stack fill available height
					overflowY: 'auto', // allow scrolling if needed
				}}>
				<DashboardMap />
			</Stack>
		</Stack>
	);
};

export default Section;
