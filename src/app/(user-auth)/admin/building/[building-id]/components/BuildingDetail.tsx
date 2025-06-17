'use client';
import React, { useState, useEffect } from 'react';
import { Stack, Button, Typography, Divider } from '@mui/material';
import CarouselImages from '@/app/components/Carousel/CarouselImages';
import { formatRupiah } from '@/app/utils/formatCurency';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useRouter } from 'next/navigation';
import { BuildingItemType } from '@/app/DTO/building';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import { InferType } from 'yup';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { DeleteBuildingRequestSchema } from '../../buildingConfig';
import CalendarModal from './CalendarModal'; // Import Calendar Modal
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import { RentBuildingItemType, RentStatus } from '@/app/(user-auth)/user/components/rentBuilding';
import { Event } from 'react-big-calendar'; // Import Event from react-big-calendar

// Extend Event from react-big-calendar
export interface CustomEvent extends Event {
	id: string; // Custom field
	eventName: string; // Event name
	userName: string; // User name
	startDate: string; // Start date as string (ISO format)
	endDate: string; // End date as string (ISO format)
	status: RentStatus; // Status
}

const BuildingDetail: React.FC<{ building: BuildingItemType }> = ({ building }) => {
	const router = useRouter();
	const [openCalendarModal, setOpenCalendarModal] = useState(false);
	const buildingId = useParams()['building-id'];
	const images = building.buildingPhoto.map(photo => photo.url);
	const address = building.buildingAddress[0];

	// Handling deletion of building
	const { mutateAsync: deleteBuilding } = useMutationApiRequest<GlobalApiResponse<any>, InferType<typeof DeleteBuildingRequestSchema>>({
		key: 'delete-building',
		authRequired: true,
	});

	const handleDelete = async () => {
		const confirmation = window.confirm('Apakah anda yakin ingin menghapus data ini?');
		if (!confirmation) return;

		try {
			await deleteBuilding({ id: building.id });
			window.alert('Building successfully deleted!');
			router.push('/admin/building');
		} catch (error) {
			console.error('Failed to delete building:', error);
		}
	};

	const [rentBuildingData, setRentBuildingData] = useState<RentBuildingItemType[] | undefined>([]);
	const { data: rentBuilding } = useQueryApiRequest<GlobalApiResponse<RentBuildingItemType[]>>({
		key: 'get-rent-building-by-building',
		withAuth: false,
		params: { buildingId: buildingId },
	});

	useEffect(() => {
		if (rentBuilding) {
			setRentBuildingData(rentBuilding.data);
		}
	}, [rentBuilding]);

	// Map rentBuildingData to CustomEvent format for react-big-calendar
	const events: CustomEvent[] =
		rentBuildingData?.map(event => ({
			title: event.eventName || '-', // Show event name
			start: new Date(event.startDate), // Convert to Date object
			end: new Date(event.endDate), // Convert to Date object
			allDay: false,
			id: event.id,
			userName: event.user.name,
			eventName: event.eventName,
			startDate: event.startDate,
			endDate: event.endDate,
			status: event.status,
		})) || [];

	return (
		<Stack
			spacing={3}
			p={{ xs: 2, md: 4 }}>
			{/* Carousel */}
			<CarouselImages images={images} />

			{/* Button to open the Calendar modal */}
			<Button
				variant='contained'
				color='primary'
				fullWidth
				onClick={() => setOpenCalendarModal(true)}
				sx={{ marginTop: 2 }}>
				Lihat Kalender
			</Button>

			{/* Nama & Harga */}
			<Stack spacing={1}>
				<Typography
					variant='h5'
					fontWeight={700}>
					{building.name}
				</Typography>
				<Typography
					variant='subtitle1'
					color='text.secondary'>
					{formatRupiah(building.price)}
				</Typography>
			</Stack>

			<Divider />

			{/* Deskripsi */}
			<Stack spacing={1}>
				<Typography
					variant='h6'
					fontWeight={600}>
					Deskripsi
				</Typography>
				<Typography
					variant='body1'
					color='text.secondary'>
					{building.description}
				</Typography>
			</Stack>

			<Divider />

			{/* Alamat */}
			<Stack spacing={1}>
				<Typography
					variant='h6'
					fontWeight={600}>
					Alamat
				</Typography>
				<Stack gap={2}>
					<Typography variant='body2'>
						<strong>Jalan:</strong> {address.jalan}
					</Typography>
					<Typography variant='body2'>
						<strong>RT/RW:</strong> {address.rt}/{address.rw}
					</Typography>
					<Typography variant='body2'>
						<strong>Kelurahan:</strong> {address.kelurahan}
					</Typography>
					<Typography variant='body2'>
						<strong>Kecamatan:</strong> {address.kecamatan}
					</Typography>
					<Typography variant='body2'>
						<strong>Kota:</strong> {address.kota}
					</Typography>
					<Typography variant='body2'>
						<strong>Provinsi:</strong> {address.provinsi}
					</Typography>
					<Typography variant='body2'>
						<strong>Kode Pos:</strong> {address.kodepos}
					</Typography>
				</Stack>
			</Stack>

			<Divider />

			{/* Dokumen Pendukung */}
			<Stack gap={2}>
				{building.supportDocumentRequirement && building.supportDocumentRequirement.length > 0 && (
					<Typography>
						<strong>Dokumen Pendukung</strong>
					</Typography>
				)}

				{building.supportDocumentRequirement &&
					building.supportDocumentRequirement.map((document, index) => (
						<Stack
							key={index}
							gap={1}>
							<Typography variant='body2'>
								{index + 1}. {document.name}
							</Typography>
							<Button
								variant='outlined'
								size='small'
								target='_blank'
								href={document.templateDocumentUrl}
								sx={{ width: 'fit-content' }}>
								Lihat Dokumen
							</Button>
						</Stack>
					))}
			</Stack>

			<Divider />

			<Stack
				flexDirection={'row'}
				justifyContent={'center'}
				alignItems={'center'}
				gap={2}>
				<Button
					color='warning'
					sx={{ gap: 2 }}
					onClick={() => router.push(`/admin/building/${building.id}/edit`)}>
					<EditIcon />
					Edit
				</Button>
				<Button
					color='error'
					sx={{ gap: 2 }}
					onClick={handleDelete}>
					<DeleteIcon />
					Hapus
				</Button>
			</Stack>

			{/* Calendar Modal */}
			<CalendarModal
				open={openCalendarModal}
				onClose={() => setOpenCalendarModal(false)}
				events={events}
			/>
		</Stack>
	);
};

export default BuildingDetail;
