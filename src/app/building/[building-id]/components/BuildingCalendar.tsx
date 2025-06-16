'use client';
import React, { useContext, useState } from 'react';
import { Stack, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Calendar, dayjsLocalizer, Event, View, ToolbarProps } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import { buildingsDummy } from '../DTO/building';
import { useParams, useRouter } from 'next/navigation';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { BuildingItemType } from '@/app/DTO/building';
import CarouselImages from '@/app/components/Carousel/CarouselImages';
import { Alert, AlertType } from '@/app/components/Alert/Alert';
import { authContext } from '@/app/provider/auth-provider/authProvider';

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
			<CarouselImages images={images} />
		</DialogContent>
		<DialogActions>
			<Button onClick={onClose}>Tutup</Button>
		</DialogActions>
	</Dialog>
);

const BuildingCalendar: React.FC = () => {
	const [date, setDate] = useState(new Date());
	const [view, setView] = useState<View>('month');
	const [openImagesModal, setOpenImagesModal] = useState(false);
	const [alertShow, setAlertShow] = useState(false);
	const [alertMessage, setAlertMessage] = useState<React.ReactNode>('');
	const [alertType, setAlertType] = useState<AlertType>('success');
	const [showTime, setShowTime] = useState<number>(4000);

	const buildingId = useParams()['building-id'];
	const { data } = useQueryApiRequest<GlobalApiResponse<BuildingItemType>>({
		key: 'get-building',
		withAuth: false,
		params: {
			id: buildingId,
		},
	});

	const { user, authenticated } = useContext(authContext);
	const building = data?.data;
	const navigation = useRouter();

	return (
		<Stack>
			<Stack
				flexDirection={'row'}
				justifyContent={'space-between'}
				alignItems={'center'}
				mb={2}>
				<Typography
					variant='h5'
					fontWeight={500}>
					{building?.name}
				</Typography>
				<Stack
					flexDirection={'row'}
					gap={1}>
					<Button
						variant='contained'
						color='success'
						onClick={() => navigation.push('/')}>
						Kembali Ke Maps
					</Button>
					<Button
						variant='contained'
						color='primary'
						onClick={() => {
							if (authenticated && user?.role === 'USER') {
								navigation.push(`/user/${buildingId}/rent`);
								return;
							}

							if (!authenticated) {
								setAlertShow(true);
								setAlertType('error');
								setAlertMessage(
									<>
										<Stack>
											<Typography>Anda belum login</Typography>
											<Typography>redirect to login</Typography>
										</Stack>
									</>
								);
								setShowTime(4000);

								setTimeout(() => {
									navigation.push('/auth/login');
								}, 3000);
							}

							if ((authenticated && user?.role === 'ADMIN') || user?.role == 'SUPERADMIN') {
								setAlertShow(true);
								setAlertType('error');
								setAlertMessage(
									<>
										<Stack>
											<Typography>Anda bukan role penyewa</Typography>
										</Stack>
									</>
								);
								setShowTime(4000);
							}
						}}>
						Sewa Gedung
					</Button>
				</Stack>
			</Stack>
			<Alert
				type={alertType}
				open={alertShow}
				onClose={() => setAlertShow(false)}
				message={alertMessage}
				timeout={showTime}
			/>
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

export default BuildingCalendar;
