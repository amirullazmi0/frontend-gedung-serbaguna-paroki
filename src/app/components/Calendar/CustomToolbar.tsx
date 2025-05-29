// Di luar komponen DashboardCalendar
import React from 'react';
import { Stack, Button, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ToolbarProps } from 'react-big-calendar';

interface CustomToolbarProps extends ToolbarProps {
	onOpenCarousel: () => void;
}

export const CustomToolbar: React.FC<CustomToolbarProps> = ({ label, onNavigate, views, onOpenCarousel }) => {
	const goToBack = () => onNavigate('PREV');
	const goToNext = () => onNavigate('NEXT');
	const goToToday = () => onNavigate('TODAY');

	return (
		<Stack style={{ marginBottom: 16 }}>
			<Stack
				flexDirection='row'
				gap={1}>
				<Button
					onClick={onOpenCarousel}
					variant='contained'
					color='secondary'>
					Lihat Gambar
				</Button>
				<Button
					onClick={goToToday}
					variant='contained'>
					Today
				</Button>
				<Button onClick={goToBack}>
					<ArrowBackIosIcon />
				</Button>
				<Button onClick={goToNext}>
					<ArrowForwardIosIcon />
				</Button>
			</Stack>
			<Typography
				variant='h5'
				textAlign='center'>
				{label}
			</Typography>
		</Stack>
	);
};
