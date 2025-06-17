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
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { RentBuildingItemType, RentStatus } from './rentBuilding';
import { useRouter } from 'next/navigation';
import { colorPallete } from '@/app/utils/colorspallete';
import { rentStatusColor, rentStatusLabelChip } from '@/app/components/RentStatusChip';

const RentBuildingTable = () => {
	const { data, isLoading } = useQueryApiRequest<GlobalApiResponse<RentBuildingItemType[]>>({
		key: 'get-rent-building-by-user',
		withAuth: true,
	});

	const router = useRouter();

	const rentList = data?.data || [];
	const [selectedItem, setSelectedItem] = useState<RentBuildingItemType | null>(null);

	const handleOpenDetail = (item: RentBuildingItemType) => setSelectedItem(item);
	const handleCloseDetail = () => setSelectedItem(null);

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
											label={rentStatusLabelChip(item.status)}
											color={rentStatusColor(item.status)}
											size='small'
											variant='outlined'
										/>
									</TableCell>
									<TableCell>{dayjs(item.startDate).format('DD MMM YYYY')}</TableCell>
									<TableCell>{dayjs(item.endDate).format('DD MMM YYYY')}</TableCell>
									<TableCell>{item._count.supportDocumentRentBuilding}</TableCell>
									<TableCell>
										<Button
											variant='outlined'
											size='small'
											onClick={() => handleOpenDetail(item)}>
											Detail
										</Button>
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
				open={!!selectedItem}
				onClose={handleCloseDetail}
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
							<Typography>Dibuat pada: {dayjs(selectedItem.createdAt).format('DD MMM YYYY HH:mm')}</Typography>

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
					<Button onClick={handleCloseDetail}>Tutup</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
};

export default RentBuildingTable;
