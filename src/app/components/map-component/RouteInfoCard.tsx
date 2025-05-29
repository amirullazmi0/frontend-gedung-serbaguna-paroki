'use client';
import React from 'react';
import { Paper, Stack, Typography, Button } from '@mui/material';
import { colorPallete } from '@/app/utils/colorspallete';

interface RouteInfoCardProps {
	distance: number;
	time: number;
	transportMode: 'car' | 'foot' | 'bike';
	onChangeTransportMode: (mode: 'car' | 'foot' | 'bike') => void;
}

const formatDistance = (meters: number) => (meters / 1000).toFixed(2) + ' km';
const formatTime = (seconds: number) => Math.ceil(seconds / 60) + ' menit';

const RouteInfoCard: React.FC<RouteInfoCardProps> = ({ distance, time, transportMode, onChangeTransportMode }) => {
	return (
		<Paper
			sx={{
				position: 'absolute',
				bottom: 16,
				left: 16,
				zIndex: 1000,
				bgcolor: colorPallete.white,
				p: 2,
				borderRadius: 2,
				width: 240,
			}}>
			<Stack gap={2}>
				<Typography
					variant='subtitle1'
					fontWeight='bold'
					gutterBottom>
					Info Rute
				</Typography>

				<Stack>
					<Typography>Pilih Mode Transportasi</Typography>
					<Stack
						spacing={1}
						mt={1}>
						<Button
							variant={transportMode === 'car' ? 'contained' : 'outlined'}
							onClick={() => onChangeTransportMode('car')}
							fullWidth>
							Mobil
						</Button>
						<Button
							variant={transportMode === 'foot' ? 'contained' : 'outlined'}
							onClick={() => onChangeTransportMode('foot')}
							fullWidth>
							Jalan Kaki
						</Button>
						<Button
							variant={transportMode === 'bike' ? 'contained' : 'outlined'}
							onClick={() => onChangeTransportMode('bike')}
							fullWidth>
							Sepeda / Motor
						</Button>
					</Stack>
				</Stack>

				<Stack>
					<Typography>Jarak: {formatDistance(distance)}</Typography>
					<Typography>Perkiraan Waktu: {formatTime(time)}</Typography>
				</Stack>
			</Stack>
		</Paper>
	);
};

export default RouteInfoCard;
