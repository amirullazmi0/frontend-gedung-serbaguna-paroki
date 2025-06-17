'use client';
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, IconButton, Box, Popover } from '@mui/material';
import { Calendar, dayjsLocalizer, ToolbarProps, View } from 'react-big-calendar'; // React Big Calendar
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import { CustomEvent } from './BuildingDetail'; // Assuming this is imported from your previous implementation

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

const CalendarModal: React.FC<{
	open: boolean;
	onClose: () => void;
	events: CustomEvent[];
}> = ({ open, onClose, events }) => {
	const [date, setDate] = useState(new Date());
	const [view, setView] = useState('month' as View);
	const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null); // Selected event for popover
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Position for the popover

	// Handle navigation actions
	const handleNavigate = (action: string) => {
		const newDate = new Date(date);
		switch (action) {
			case 'PREV':
				newDate.setMonth(newDate.getMonth() - 1);
				setDate(newDate);
				break;
			case 'NEXT':
				newDate.setMonth(newDate.getMonth() + 1);
				setDate(newDate);
				break;
			case 'TODAY':
				setDate(new Date());
				break;
			default:
				break;
		}
	};

	// Handle event click to show the details in the popover
	const handleEventClick = (event: CustomEvent, e: React.SyntheticEvent<HTMLElement, Event>) => {
		setSelectedEvent(event);
		setAnchorEl(e.currentTarget); // Set popover anchor to clicked event
	};

	// Close the popover
	const handlePopoverClose = () => {
		setAnchorEl(null);
		setSelectedEvent(null);
	};

	const openPopover = Boolean(anchorEl); // Check if popover should open

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='lg'
			fullWidth>
			<DialogTitle>
				Kalender Sewa Gedung
				<Button
					onClick={onClose}
					sx={{ position: 'absolute', right: 8, top: 8 }}>
					<CloseIcon />
				</Button>
			</DialogTitle>
			<DialogContent dividers>
				<Calendar
					localizer={dayjsLocalizer(dayjs)}
					events={events}
					startAccessor='start'
					endAccessor='end'
					style={{ height: 600 }}
					date={date}
					view={view}
					onNavigate={setDate} // Pass handleNavigate to control calendar navigation
					onSelectEvent={handleEventClick} // Event click handler to open popover
					components={{
						toolbar: props => (
							<CustomToolbar
								{...props}
								onNavigate={handleNavigate}
								onOpenImages={() => console.log('Open images')} // Handle images
							/>
						),
					}}
				/>

				{/* Event Details Popover (Floating Card) */}
				<Popover
					open={openPopover}
					anchorEl={anchorEl}
					onClose={handlePopoverClose}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					transitionDuration={{ enter: 500, exit: 0 }}
					transformOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}>
					<Box sx={{ p: 2 }}>
						<Typography variant='h6'>{selectedEvent?.eventName}</Typography>
						<Typography variant='body1'>{`Penyewa: ${selectedEvent?.userName ?? '-'}`}</Typography>
						<Typography
							variant='body2'
							color='textSecondary'>
							{`Mulai: ${dayjs(selectedEvent?.startDate).format('DD MMM YYYY')}`}
						</Typography>
						<Typography
							variant='body2'
							color='textSecondary'>
							{`Selesai: ${dayjs(selectedEvent?.endDate).format('DD MMM YYYY')}`}
						</Typography>
					</Box>
				</Popover>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Tutup</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CalendarModal;
