'use client';
import { BuildingItemType } from '@/app/DTO/building';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { Card, CardActions, CardContent, Divider, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SourceIcon from '@mui/icons-material/Source';
import { formatRupiah } from '@/app/utils/formatCurency';
import { useRouter } from 'next/navigation';

const BuildingCard = () => {
	const router = useRouter();
	const { data, isLoading } = useQueryApiRequest<GlobalApiResponse<BuildingItemType[]>>({
		key: 'get-building',
		withAuth: false,
	});

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	if (isLoading) {
		return <Typography textAlign='center'>Loading...</Typography>;
	}

	const renderAddress = (address?: BuildingItemType['buildingAddress'][0]) => {
		if (!address) return '-';
		return `${address.jalan}, ${address.rt}/${address.rw}, ${address.kelurahan}, ${address.kecamatan}, ${address.kota}, ${address.provinsi} ${address.kodepos}`;
	};

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
						md: 'repeat(4, 1fr)', // 3 columns on medium screens
						lg: 'repeat(6, 1fr)', // 5 columns on large screens
					},
				}}>
				{data?.data?.map((row, index) => (
					<Card
						key={index}
						sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
								mt={1}
								height={'80px'}>
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
								onClick={() => router.push(`/building/${row.id}`)}>
								<SourceIcon />
							</IconButton>
						</CardActions>
					</Card>
				))}
			</Stack>
		</Stack>
	);
};

export default BuildingCard;
