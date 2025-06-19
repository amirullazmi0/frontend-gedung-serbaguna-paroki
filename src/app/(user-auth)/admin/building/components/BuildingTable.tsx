'use client';
import { BuildingItemType } from '@/app/DTO/building';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { Card, CardActions, CardContent, Divider, IconButton, Stack, Typography, useMediaQuery, useTheme, Snackbar, Alert } from '@mui/material';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SourceIcon from '@mui/icons-material/Source';
import { formatRupiah } from '@/app/utils/formatCurency';
import { useRouter } from 'next/navigation';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import { DeleteBuildingRequestSchema } from '../buildingConfig';
import { InferType } from 'yup';

const BuildingTable = () => {
	const router = useRouter();
	const { data, isLoading } = useQueryApiRequest<GlobalApiResponse<BuildingItemType[]>>({
		key: 'get-admin-building',
		withAuth: true,
	});

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [deleteMessage, setDeleteMessage] = useState('');
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const { mutateAsync: deleteBuilding, isSuccess: isDeleteSuccess } = useMutationApiRequest<GlobalApiResponse<any>, InferType<typeof DeleteBuildingRequestSchema>>({
		key: 'delete-building',
		authRequired: true,
		options: {
			onSuccess: () => {
				router.refresh();
			},
		},
	});

	useEffect(() => {
		if (isDeleteSuccess) {
			setDeleteMessage('Data berhasil dihapus !');
			setOpenSnackbar(true); // Show Snackbar on success
			setTimeout(() => setOpenSnackbar(false), 3000); // Hide Snackbar after 3 seconds
		}
	}, [isDeleteSuccess]);

	const handleDelete = async (id: string) => {
		const confirmation = window.confirm('Apakah anda yakin ingin menghapus data ini?');
		if (!confirmation) return;
		try {
			await deleteBuilding({ id });
		} catch (error) {
			console.error('Failed to delete building:', error);
		}
	};

	const renderAddress = (address?: BuildingItemType['buildingAddress'][0]) => {
		if (!address) return '-';
		return `${address.jalan}, ${address.rt}/${address.rw}, ${address.kelurahan}, ${address.kecamatan}, ${address.kota}, ${address.provinsi} ${address.kodepos}`;
	};

	if (isLoading) {
		return <Typography textAlign='center'>Loading...</Typography>;
	}

	return (
		<Stack
			mt={5}
			px={{ xs: 2, md: 5 }}>
			<Stack
				display='grid'
				gap={2}
				sx={{
					gridTemplateColumns: {
						xs: 'repeat(1, 1fr)', // 1 column on mobile
						md: 'repeat(3, 1fr)', // 3 columns on medium screens
						lg: 'repeat(4, 1fr)', // 4 columns on large screens
					},
				}}>
				{data?.data?.map((row, index) => (
					<Card
						key={index}
						elevation={0}
						sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 4 }}>
						<CardContent>
							<Typography
								variant='subtitle2'
								color='textSecondary'>
								Gedung #{index + 1}
							</Typography>
							<Typography variant='h6'>{row.name}</Typography>
							<Typography>{formatRupiah(row.price)}</Typography>
							<Typography
								variant='body2'
								mt={1}>
								{renderAddress(row.buildingAddress?.[0])}
							</Typography>

							{row.buildingPhoto?.[0]?.url && (
								<Image
									alt={`${row.name} photo`}
									src={row.buildingPhoto[0].url}
									width={400}
									height={200}
									style={{ objectFit: 'cover', borderRadius: 8, marginTop: 10, width: '100%' }}
								/>
							)}
						</CardContent>
						<Divider />
						<CardActions sx={{ justifyContent: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
							<IconButton
								color='success'
								onClick={() => router.push(`/admin/building/${row.id}`)}>
								<SourceIcon />
							</IconButton>
							<IconButton
								color='warning'
								onClick={() => router.push(`/admin/building/${row.id}/edit`)}>
								<EditIcon />
							</IconButton>
							{/* <IconButton
								color='error'
								onClick={() => handleDelete(row.id)}>
								<DeleteIcon />
							</IconButton> */}
						</CardActions>
					</Card>
				))}
			</Stack>

			{/* Snackbar for success message */}
			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={() => setOpenSnackbar(false)}>
				<Alert
					onClose={() => setOpenSnackbar(false)}
					severity='success'
					sx={{ width: '100%' }}>
					{deleteMessage}
				</Alert>
			</Snackbar>
		</Stack>
	);
};

export default BuildingTable;
