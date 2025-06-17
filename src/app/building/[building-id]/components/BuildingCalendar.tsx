'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Stack, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Calendar, dayjsLocalizer, Event, View, ToolbarProps, NavigateAction } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useParams, useRouter } from 'next/navigation';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { BuildingItemType } from '@/app/DTO/building';
import CarouselImages from '@/app/components/Carousel/CarouselImages';
import { Alert, AlertType } from '@/app/components/Alert/Alert';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import { RentBuildingItemType, RentStatus } from '@/app/(user-auth)/user/components/rentBuilding';

const localizer = dayjsLocalizer(dayjs);

interface CustomEvent extends Event {
	id: string; // Custom field
	eventName: string;
	startDate: string;
	endDate: string;
	status: RentStatus;
}

const CustomToolbar: React.FC<ToolbarProps<CustomEvent> & { onOpenImages: () => void }> = ({ label, onNavigate, onOpenImages }) => {
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

const ImageListModal: React.FC<{ open: boolean; images: string[]; onClose: () => void }> = ({ open, images, onClose }) => (
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
	const [openEventModal, setOpenEventModal] = useState(false); // State for event modal
	const [selectedEvent, setSelectedEvent] = useState<RentBuildingItemType | null>(null);

	const buildingId = useParams()['building-id'];

	// Fetch building data and rent events
	const { data } = useQueryApiRequest<GlobalApiResponse<BuildingItemType>>({
		key: 'get-building',
		withAuth: false,
		params: { id: buildingId },
	});

	const { data: rentBuilding } = useQueryApiRequest<GlobalApiResponse<RentBuildingItemType[]>>({
		key: 'get-rent-building-by-building',
		withAuth: false,
		params: { buildingId: buildingId },
	});

	const [rentBuildingData, setRentBuildingData] = useState<RentBuildingItemType[] | undefined>([]);

	useEffect(() => {
		if (rentBuilding) {
			// Filter the events to only include those with a "SUCCESS" status
			const filteredRentBuildingData = rentBuilding?.data?.filter(event => event.status === RentStatus.SUCCESS);
			setRentBuildingData(filteredRentBuildingData);
		}
	}, [rentBuilding]);

	// Map rentBuildingData to events for react-big-calendar
	const events: CustomEvent[] =
		rentBuildingData?.map(event => ({
			title: `${event.eventName || '-'}`, // Show event name and status
			start: new Date(event.startDate),
			end: new Date(event.endDate),
			allDay: false,
			id: event.id,
			eventName: event.eventName,
			startDate: event.startDate,
			endDate: event.endDate,
			status: event.status,
		})) || [];

	const { user, authenticated } = useContext(authContext);
	const building = data?.data;
	const navigation = useRouter();

	const handleEventClick = (event: CustomEvent) => {
		// Set the selected event and open the modal
		const clickedEvent = rentBuildingData?.find(rent => rent.id === event.id);
		if (clickedEvent) {
			setSelectedEvent(clickedEvent);
			setOpenEventModal(true);
		}
	};

	const handleModalClose = () => {
		setOpenEventModal(false);
		setSelectedEvent(null);
	};

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

							if ((authenticated && user?.role === 'ADMIN') || user?.role === 'SUPERADMIN') {
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
				onSelectEvent={handleEventClick} // Event click handler
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

			{/* Modal for Rent Event Details */}
			<Dialog
				open={openEventModal}
				onClose={handleModalClose}
				maxWidth='sm'
				fullWidth>
				<IconButton
					aria-label='close'
					onClick={handleModalClose}
					sx={{ position: 'absolute', right: 8, top: 8, color: theme => theme.palette.grey[500] }}
					size='large'>
					<CloseIcon />
				</IconButton>

				<DialogContent dividers>
					{selectedEvent ? (
						<>
							{/* <CarouselImages images={data?.data?.buildingPhoto?.map(photo => photo.url) ?? []} /> */}
							<Typography variant='h6'>Kegiatan : {selectedEvent.eventName ?? '-'}</Typography>
							<Typography>Penyewa : {selectedEvent.user.name ?? '-'}</Typography>
							<Typography
								variant='subtitle1'
								color='textSecondary'>
								{`Mulai: ${dayjs(selectedEvent.startDate).format('DD MMM YYYY')}`}
							</Typography>
							<Typography
								variant='subtitle1'
								color='textSecondary'>
								{`Selesai: ${dayjs(selectedEvent.endDate).format('DD MMM YYYY')}`}
							</Typography>
						</>
					) : (
						<Typography variant='body1'>No event selected</Typography>
					)}
				</DialogContent>
			</Dialog>
		</Stack>
	);
};

export default BuildingCalendar;
