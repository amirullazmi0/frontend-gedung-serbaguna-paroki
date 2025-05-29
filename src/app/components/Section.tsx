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
				{/* <DashboardCalendar /> */}
				<DashboardMap />
			</Stack>
			{/* <Stack
				sx={{
					padding: 2,
					bgcolor: colorPallete.white,
					boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.25)',
					height: '100%', // full height as well
					overflowY: 'auto',
				}}>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga repudiandae natus debitis sunt voluptates excepturi, consequatur dolore, iure animi voluptatem sed placeat consectetur? Dolorem
				cupiditate sunt, voluptate placeat ad quaerat!
			</Stack> */}
		</Stack>
	);
};

export default Section;
