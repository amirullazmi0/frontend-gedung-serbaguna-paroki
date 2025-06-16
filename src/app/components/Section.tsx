import { Stack } from '@mui/material';
import React from 'react';
import DashboardCalendar from './DashboardCalendar';
import { colorPallete } from '../utils/colorspallete';
import DashboardMap from './DashboardMap';

const Section = () => {
	return (
		<Stack>
			<DashboardMap />
		</Stack>
	);
};

export default Section;
