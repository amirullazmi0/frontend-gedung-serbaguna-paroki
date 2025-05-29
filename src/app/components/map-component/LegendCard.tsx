'use client';
import React from 'react';
import { Stack, Button, FormControlLabel, Checkbox } from '@mui/material';
import { colorPallete } from '@/app/utils/colorspallete';

interface LegendCardProps {
	layers: { name: string; kode: string }[];
	selectedTile: string;
	onChangeTile: (tile: string) => void;
	onUpdateUserLocation: () => void;
	onClearRoute: () => void;
	hasRoute: boolean;
}

export const LegendCard: React.FC<LegendCardProps> = ({ layers, selectedTile, onChangeTile, onUpdateUserLocation, onClearRoute, hasRoute }) => {
	return (
		<Stack
			position='absolute'
			bottom={0}
			right={0}
			zIndex={10}
			sx={{ padding: 2, bgcolor: colorPallete.white, borderRadius: 2, m: 4, width: 240 }}>
			{layers.map(item => {
				const isSelected = selectedTile === item.kode;
				return (
					<FormControlLabel
						key={item.name}
						control={
							<Checkbox
								checked={isSelected}
								onChange={() => onChangeTile(item.kode)}
							/>
						}
						label={item.name}
					/>
				);
			})}

			<Button
				variant='contained'
				onClick={onUpdateUserLocation}
				sx={{ mt: 2 }}>
				Lokasi Saya Sekarang
			</Button>

			{hasRoute && (
				<Button
					variant='outlined'
					color='error'
					sx={{ mt: 1 }}
					onClick={onClearRoute}>
					Hapus Rute
				</Button>
			)}
		</Stack>
	);
};
