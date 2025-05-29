'use client';
import React, { useState } from 'react';
import { Stack, Button, Typography } from '@mui/material';
import { Calendar, dayjsLocalizer, Event, View, ToolbarProps, SlotInfo } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
const localizer = dayjsLocalizer(dayjs);

const events: Event[] = [
	{
		title: 'Meeting Tim',
		start: new Date(2025, 4, 27, 10, 0),
		end: new Date(2025, 4, 30, 11, 0),
		allDay: false,
	},
	{
		title: 'Workshop',
		start: new Date(2025, 4, 28),
		end: new Date(2025, 4, 29),
		allDay: true,
	},
	{
		title: 'Workshop',
		start: new Date(2025, 4, 2),
		end: new Date(2025, 4, 8),
		allDay: true,
	},
];

// Label map untuk views
const viewLabels: Record<string, string> = {
	month: 'Month',
	agenda: 'Agenda',
};

const CustomToolbar: React.FC<ToolbarProps> = toolbar => {
	const goToBack = () => toolbar.onNavigate('PREV');
	const goToNext = () => toolbar.onNavigate('NEXT');
	const goToToday = () => toolbar.onNavigate('TODAY');

	const views = Object.entries(toolbar.views)
		.filter(([_, enabled]) => enabled)
		.map(([view]) => view);

	return (
		<Stack style={{ marginBottom: 16 }}>
			<Stack flexDirection={'row'}>
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
				textAlign={'center'}>
				{toolbar.label}
			</Typography>
		</Stack>
	);
};

const DashboardCalendar: React.FC = () => {
	const [date, setDate] = useState<Date>(new Date());
	const [view, setView] = useState<View>('month');

	const handleSelectEvent = (event: Event) => {
		console.log('Event selected:', event);
	};

	// Fungsi untuk menangani klik tanggal (day click)
	const handleSelectSlot = (slotInfo: SlotInfo) => {
		console.log('Tanggal diklik:', slotInfo.start);
		alert(`Tanggal yang kamu klik: ${dayjs(slotInfo.start).format('YYYY-MM-DD')}`);
	};

	return (
		<Stack>
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
				toolbar={true}
				components={{ toolbar: CustomToolbar }}
				onSelectEvent={handleSelectEvent}
			/>
		</Stack>
	);
};

export default DashboardCalendar;
