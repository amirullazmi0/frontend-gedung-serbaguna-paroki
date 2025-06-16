'use client';
import CarouselImages from '@/app/components/Carousel/CarouselImages';
import { BuildingItemType } from '@/app/DTO/building';
import { formatRupiah } from '@/app/utils/formatCurency';
import { Divider, Button, Stack, Typography } from '@mui/material';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
interface Props {
	building: BuildingItemType;
}

const BuildingDetail: React.FC<Props> = ({ building }) => {
	const images = building.buildingPhoto.map(photo => photo.url);
	const address = building.buildingAddress[0];

	return (
		<Stack
			spacing={3}
			p={{ xs: 2, md: 4 }}>
			{/* Carousel */}
			<CarouselImages images={images} />

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
			<Stack
				flexDirection={'row'}
				justifyContent={'center'}
				alignItems={'center'}
				gap={2}>
				<Button
					color='warning'
					sx={{ gap: 2 }}>
					<EditIcon />
					Edit
				</Button>
				<Button
					color='error'
					sx={{ gap: 2 }}>
					<DeleteIcon />
					Hapus
				</Button>
			</Stack>
		</Stack>
	);
};

export default BuildingDetail;
