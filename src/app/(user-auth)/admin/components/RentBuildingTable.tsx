'use client';
import React, { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	CircularProgress,
	Stack,
	Chip,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import dayjs from 'dayjs';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { RentBuildingItemType, RentStatus } from '../../user/components/rentBuilding';
import { useForm } from 'react-hook-form';
import { InferType } from 'yup';
import { updateRentBuildingSchema } from './RentUpdateConfig';
import { yupResolver } from '@hookform/resolvers/yup';

import { colorPallete } from '@/app/utils/colorspallete';
import { rentStatusColor, rentStatusLabelChip } from '@/app/components/RentStatusChip';

const RentBuildingTable = () => {
	const { data, isLoading, refetch } = useQueryApiRequest<GlobalApiResponse<RentBuildingItemType[]>>({
		key: 'get-rent-building-by-admin',
		withAuth: true,
	});

	const { mutateAsync: updateRent, isPending } = useMutationApiRequest<GlobalApiResponse<any>, InferType<typeof updateRentBuildingSchema>>({
		key: 'update-rent-building',
		authRequired: true,
	});

	const { handleSubmit } = useForm<InferType<typeof updateRentBuildingSchema>>({
		resolver: yupResolver(updateRentBuildingSchema),
	});

	const rentList = data?.data || [];

	const [selectedItem, setSelectedItem] = useState<RentBuildingItemType | null>(null);
	const [openDetail, setOpenDetail] = useState(false);

	const handleStatusUpdate = async (data: InferType<typeof updateRentBuildingSchema>) => {
		try {
			await updateRent(data);
			await refetch();
		} catch (err) {
			console.error('Failed to update status:', err);
		}
	};

	const openDetailModal = (item: RentBuildingItemType) => {
		setSelectedItem(item);
		setOpenDetail(true);
	};

	const closeDetailModal = () => {
		setOpenDetail(false);
		setSelectedItem(null);
	};

	return (
		<Stack p={2}>
			<Typography
				variant='h6'
				mb={2}>
				Daftar Peminjaman Gedung
			</Typography>

			{isLoading ? (
				<Stack
					alignItems='center'
					mt={4}>
					<CircularProgress />
				</Stack>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Nama Gedung</TableCell>
								<TableCell sx={{ bgcolor: colorPallete.primary, color: 'white' }}>Kegiatan</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Tanggal Mulai</TableCell>
								<TableCell>Tanggal Selesai</TableCell>
								<TableCell>Jumlah Dokumen</TableCell>
								<TableCell>Aksi</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rentList.map((item, index) => (
								<TableRow key={item.id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{item.building?.name || '-'}</TableCell>
									<TableCell sx={{ bgcolor: colorPallete['low-grey'] }}>{item.eventName || '-'}</TableCell>
									<TableCell>
										<Chip
											label={item.status}
											color={rentStatusColor(item.status)}
											size='small'
											variant='outlined'
										/>
									</TableCell>
									<TableCell>{dayjs(item.startDate).format('DD MMM YYYY')}</TableCell>
									<TableCell>{dayjs(item.endDate).format('DD MMM YYYY')}</TableCell>
									<TableCell>{item._count.supportDocumentRentBuilding}</TableCell>
									<TableCell>
										<Stack
											gap={1}
											direction='row'>
											<Button
												variant='outlined'
												size='small'
												onClick={() => openDetailModal(item)}>
												Detail
											</Button>

											{item.status === 'PENDING' && (
												<>
													<Button
														variant='contained'
														color='error'
														size='small'
														disabled={isPending}
														onClick={() => handleStatusUpdate({ id: item.id, status: RentStatus.CANCELLED })}>
														Batalkan
													</Button>
													<Button
														variant='contained'
														color='success'
														size='small'
														disabled={isPending}
														onClick={() => handleStatusUpdate({ id: item.id, status: RentStatus.ONPROSES })}>
														Proses
													</Button>
												</>
											)}

											{item.status === 'ONPROSES' && (
												<Button
													variant='contained'
													color='primary'
													size='small'
													disabled={isPending}
													onClick={() => handleStatusUpdate({ id: item.id, status: RentStatus.SUCCESS })}>
													Selesai
												</Button>
											)}
										</Stack>
									</TableCell>
								</TableRow>
							))}
							{rentList.length === 0 && (
								<TableRow>
									<TableCell colSpan={6}>
										<Typography
											textAlign='center'
											py={2}>
											Tidak ada data peminjaman
										</Typography>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			{/* Modal Detail */}
			<Dialog
				open={openDetail}
				onClose={closeDetailModal}
				maxWidth='md'
				fullWidth>
				<DialogTitle>Detail Peminjaman</DialogTitle>
				<DialogContent dividers>
					{selectedItem && (
						<Stack spacing={2}>
							<Typography>Nama Gedung: {selectedItem.building.name}</Typography>
							<Typography>
								Status:{' '}
								<Chip
									label={rentStatusLabelChip(selectedItem.status)}
									color={rentStatusColor(selectedItem.status)}
									size='small'
									variant='outlined'
								/>
							</Typography>
							<Typography>Tanggal Mulai: {dayjs(selectedItem.startDate).format('DD MMM YYYY')}</Typography>
							<Typography>Tanggal Selesai: {dayjs(selectedItem.endDate).format('DD MMM YYYY')}</Typography>
							{selectedItem.supportDocumentRentBuilding.length > 0 && (
								<Stack
									gap={2}
									p={1}
									border={`1px solid ${colorPallete['low-grey']}`}>
									<Typography>Dokumen:</Typography>
									{selectedItem.supportDocumentRentBuilding.map((document, index) => (
										<Stack
											flexDirection={'row'}
											gap={1}>
											<Typography>
												{index + 1}. {document.supportDocumentRequirement.name}
											</Typography>
											<Button
												variant='outlined'
												size='small'
												target='_blank'
												href={`${document.documentUrl}`}
												sx={{
													width: 'fit-content',
												}}>
												Lihat
											</Button>
										</Stack>
									))}
								</Stack>
							)}

							{selectedItem.invoice.length > 0 && (
								<Stack flexDirection={'row'}>
									<Typography>Invoice: </Typography>
									<Button
										variant='outlined'
										size='small'
										target='_blank'
										href={`${selectedItem.invoice[0].url}`}
										sx={{
											width: 'fit-content',
										}}>
										Lihat
									</Button>
								</Stack>
							)}
							<Typography>Created At: {dayjs(selectedItem.createdAt).format('DD MMM YYYY HH:mm')}</Typography>

							<Typography>Foto Gedung:</Typography>
							<Stack
								direction='row'
								gap={2}
								flexWrap='wrap'>
								{selectedItem.building.buildingPhoto.map(photo => (
									<img
										key={photo.id}
										src={photo.url}
										alt='Gedung'
										style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
									/>
								))}
							</Stack>
						</Stack>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDetailModal}>Tutup</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
};

export default RentBuildingTable;
