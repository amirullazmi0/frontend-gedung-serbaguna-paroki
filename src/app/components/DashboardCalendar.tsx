'use client';
import React, { useState } from 'react';
import { Stack, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Calendar, dayjsLocalizer, Event, View, ToolbarProps } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import { buildingsDummy } from '../DTO/building';
import { useParams, useRouter } from 'next/navigation';
import useQueryApiRequest from '../hook/useQueryApiRequest';
import { GlobalApiResponse } from '../utils/globalsApiResponse';
import { BuildingItemType } from '../DTO/building';

const localizer = dayjsLocalizer(dayjs);

const events: Event[] = [
	{ title: 'Weeding', start: new Date(2025, 4, 27, 10, 0), end: new Date(2025, 4, 30, 11, 0), allDay: false },
	{ title: 'Meeting', start: new Date(2025, 4, 28), end: new Date(2025, 4, 29), allDay: true },
	{ title: 'Workshop', start: new Date(2025, 4, 2), end: new Date(2025, 4, 8), allDay: true },
];

const CustomToolbar: React.FC<ToolbarProps & { onOpenImages: () => void }> = ({ label, onNavigate, onOpenImages }) => {
	const goToBack = () => onNavigate('PREV');
	const goToNext = () => onNavigate('NEXT');
	const goToToday = () => onNavigate('TODAY');

	return (
		<Stack style={{ marginBottom: 16 }}>
			<Stack
				flexDirection='row'
				gap={1}>
				<Button
					onClick={onOpenImages}
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

const ImageListModal: React.FC<{
	open: boolean;
	images: string[];
	onClose: () => void;
}> = ({ open, images, onClose }) => (
	<Dialog
		open={open}
		onClose={onClose}
		maxWidth='md'
		fullWidth>
		<DialogTitle>
			Gambar Gedung
			<IconButton
				aria-label='close'
				onClick={onClose}
				sx={{ position: 'absolute', right: 8, top: 8, color: theme => theme.palette.grey[500] }}
				size='large'>
				<CloseIcon />
			</IconButton>
		</DialogTitle>
		<DialogContent dividers>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				flexWrap='wrap'
				spacing={2}
				justifyContent='center'
				sx={{ maxHeight: 400, overflowY: 'auto', p: 1 }}>
				{images.length > 0 ? (
					images.map((url, i) => (
						<Box
							key={i}
							component='img'
							src={url}
							alt={`Image ${i + 1}`}
							sx={{
								width: { xs: '100%', sm: '48%', md: '30%' },
								borderRadius: 2,
								objectFit: 'cover',
								maxHeight: 200,
							}}
						/>
					))
				) : (
					<Typography>Tidak ada gambar tersedia.</Typography>
				)}
			</Stack>
		</DialogContent>
		<DialogActions>
			<Button onClick={onClose}>Tutup</Button>
		</DialogActions>
	</Dialog>
);

const DashboardCalendar: React.FC = () => {
	const [date, setDate] = useState(new Date());
	const [view, setView] = useState<View>('month');
	const [openImagesModal, setOpenImagesModal] = useState(false);

	const buildingId = useParams()['building-id'];
	const { data } = useQueryApiRequest<GlobalApiResponse<BuildingItemType>>({
		key: 'get-building',
		withAuth: false,
	});

	const building = data?.data;
	const navigation = useRouter();

	return (
		<Stack>
			<Stack
				alignItems='flex-end'
				mb={2}>
				<Button
					variant='contained'
					color='success'
					onClick={() => navigation.push('/')}>
					Kembali Ke Maps
				</Button>
			</Stack>

			<Calendar
				localizer={localizer}
				events={events}
				startAccessor='start'
				endAccessor='end'
				style={{ height: 600, width: '100%' }}
				views={{ month: true, agenda: true }}
				date={date}
				view={view}
				onNavigate={setDate}
				onView={setView}
				toolbar
				components={{
					toolbar: props => (
						<CustomToolbar
							{...props}
							onOpenImages={() => setOpenImagesModal(true)}
						/>
					),
				}}
			/>

			{building && building.buildingPhoto && (
				<ImageListModal
					open={openImagesModal}
					images={(building.buildingPhoto ?? []).map(photo => photo.url)}
					onClose={() => setOpenImagesModal(false)}
				/>
			)}
		</Stack>
	);
};

export default DashboardCalendar;
