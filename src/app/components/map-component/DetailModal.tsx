'use client';
import React from 'react';
import Image from 'next/image';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { BuildingItemType } from '@/app/DTO/building';
import CarouselImages from '../Carousel/CarouselImages';
import { formatRupiah } from '@/app/utils/formatCurency';

interface DetailModalProps {
	open: boolean;
	onClose: () => void;
	data?: BuildingItemType;
}

const DetailModal: React.FC<DetailModalProps> = ({ open, data, onClose }) => {
	const navigation = useRouter();
	const images = data?.buildingPhoto;
	const address = data?.buildingAddress[0];
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth={false}
			PaperProps={{
				sx: {
					width: {
						xs: '90vw', // mobile
						sm: '80vw', // tablet
						md: '50vw', // desktop
					},
					maxWidth: 'none',
				},
			}}>
			<DialogTitle>{data?.name}</DialogTitle>
			<DialogContent dividers>
				<Stack gap={2}>
					<Stack gap={3}>
						<CarouselImages images={(images ?? []).map(photo => photo.url)} />
						<hr />
						<Typography variant='h6'>{formatRupiah(data?.price ?? 0)}</Typography>
						<hr />
						<Typography>{`${address?.jalan} RT ${address?.rt} RW ${address?.rw}, ${address?.kelurahan}, ${address?.kecamatan}, ${address?.kota}, ${address?.provinsi} ${address?.kodepos}`}</Typography>
					</Stack>
					<Stack
						direction={'row'}
						gap={1}>
						<Button
							variant='contained'
							target='_blank'
							href={`https://www.google.com/maps/search/?api=1&query=${address?.lat},${address?.lng}`}>
							Lihat di Google Maps
						</Button>
						<Button
							variant='contained'
							onClick={() => navigation.push(`/building/${data?.id}`)}
							color='warning'>
							Cek Jadwal
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Tutup</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DetailModal;
