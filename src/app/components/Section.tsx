'use client';
import { Stack } from '@mui/material';
import React from 'react';
import dynamic from 'next/dynamic';

const DashboardMap = dynamic(() => import('./DashboardMap'), { ssr: false });

const Section = () => {
	return (
		<Stack>
			<DashboardMap />
		</Stack>
	);
};

export default Section;
