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

const RentBuildingTable = () => {
	const { data, isLoading } = useQueryApiRequest<GlobalApiResponse<RentBuildingItemType[]>>({
		key: 'get-rent-building-by-user',
		withAuth: true,
	});

	const rentList = data?.data || [];
	const [selectedItem, setSelectedItem] = useState<RentBuildingItemType | null>(null);

	const handleOpenDetail = (item: RentBuildingItemType) => setSelectedItem(item);
	const handleCloseDetail = () => setSelectedItem(null);

	const getStatusColor = (status: RentStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
		switch (status) {
			case RentStatus.PENDING:
				return 'warning';
			case RentStatus.ONPROSES:
				return 'info';
			case RentStatus.SUCCESS:
				return 'success';
			case RentStatus.CANCELLED:
				return 'error';
			default:
				return 'default';
		}
	};

	const statusLabel = (status: RentStatus) => {
		switch (status) {
			case RentStatus.PENDING:
				return 'Menunggu';
			case RentStatus.ONPROSES:
				return 'Diproses';
			case RentStatus.SUCCESS:
				return 'Selesai';
			case RentStatus.CANCELLED:
				return 'Dibatalkan';
			default:
				return status;
		}
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
								<TableCell>Nama Gedung</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Tanggal Mulai</TableCell>
								<TableCell>Tanggal Selesai</TableCell>
								<TableCell>Jumlah Dokumen</TableCell>
								<TableCell>Aksi</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rentList.map(item => (
								<TableRow key={item.id}>
									<TableCell>{item.building?.name || '-'}</TableCell>
									<TableCell>
										<Chip
											label={statusLabel(item.status)}
											color={getStatusColor(item.status)}
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
							<Typography>Status: {statusLabel(selectedItem.status)}</Typography>
							<Typography>Tanggal Mulai: {dayjs(selectedItem.startDate).format('DD MMM YYYY')}</Typography>
							<Typography>Tanggal Selesai: {dayjs(selectedItem.endDate).format('DD MMM YYYY')}</Typography>
							<Typography>Jumlah Dokumen: {selectedItem._count.supportDocumentRentBuilding}</Typography>
							<Typography>Jumlah Invoice: {selectedItem._count.invoice}</Typography>
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
					<Button onClick={handleCloseDetail}>Tutup</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
};

export default RentBuildingTable;
