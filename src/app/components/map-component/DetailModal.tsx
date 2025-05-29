'use client';
import React from 'react';
import Image from 'next/image';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Stack, Typography } from '@mui/material';
import { buildingItemType } from '@/app/DTO/building';
import { useRouter } from 'next/navigation';

interface DetailModalProps {
	open: boolean;
	onClose: () => void;
	data?: buildingItemType;
}

const DetailModal: React.FC<DetailModalProps> = ({ open, data, onClose }) => {
	const navigation = useRouter();
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
				<DialogContentText sx={{ mb: 2 }}>{data?.description}</DialogContentText>
				<Stack gap={2}>
					<Stack
						direction='row'
						spacing={2}
						flexWrap='wrap'
						gap={2}
						// justifyContent='center'
						sx={{ maxHeight: 300, overflowY: 'auto' }}>
						{data?.image && data.image.length > 0 ? (
							data.image.map((url, index) => (
								<Stack
									key={index}
									sx={{
										position: 'relative',
										width: {
											xs: '100%',
											sm: '50%',
											md: '33.33%',
										},
										// height: 150,
										aspectRatio: '16/9',
										borderRadius: 2,
										overflow: 'hidden',
										flexShrink: 0,
									}}>
									<Image
										src={url}
										alt={`${data.name} image ${index + 1}`}
										fill
										style={{ objectFit: 'cover' }}
										priority={index === 0}
									/>
								</Stack>
							))
						) : (
							<Typography
								variant='body2'
								color='text.secondary'>
								Tidak ada gambar tersedia.
							</Typography>
						)}
					</Stack>
					<Stack
						direction={'row'}
						gap={1}>
						<Button
							variant='contained'
							target='_blank'
							href={`https://www.google.com/maps/search/?api=1&query=${data?.latitude},${data?.longitude}`}>
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
