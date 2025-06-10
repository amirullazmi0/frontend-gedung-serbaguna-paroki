'use client';
import { Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

const Section = () => {
	const navigation = useRouter();
	return (
		<Stack>
			<Stack alignItems={'flex-end'}>
				<Button
					variant='contained'
					onClick={() => navigation.push('/admin/building/add')}>
					Tambah Gedung
				</Button>
			</Stack>
		</Stack>
	);
};

export default Section;
