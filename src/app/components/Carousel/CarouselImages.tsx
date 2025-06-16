'use client';
import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';

interface CarouselImagesProps {
	images: string[];
}

const CarouselImages: React.FC<CarouselImagesProps> = ({ images }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	if (images.length === 0) {
		return (
			<Box py={5}>
				<Typography textAlign='center'>Tidak ada gambar tersedia</Typography>
			</Box>
		);
	}

	return (
		<Stack
			spacing={2}
			alignItems='center'>
			{/* Gambar utama */}
			<Box
				sx={{
					position: 'relative',
					width: '100%',
					maxWidth: 600,
					height: { xs: 200, sm: 300, md: 400 },
					borderRadius: 2,
					overflow: 'hidden',
				}}>
				<Image
					src={images[selectedIndex]}
					alt={`Gambar ${selectedIndex + 1}`}
					fill
					style={{ objectFit: 'cover' }}
				/>
			</Box>

			{/* Thumbnail selector */}
			<Stack
				direction='row'
				spacing={1}
				flexWrap='wrap'
				justifyContent='center'>
				{images.map((img, idx) => (
					<Box
						key={idx}
						onClick={() => setSelectedIndex(idx)}
						sx={{
							position: 'relative',
							width: 60,
							height: 60,
							borderRadius: 1,
							overflow: 'hidden',
							cursor: 'pointer',
							border: selectedIndex === idx ? '2px solid #1976d2' : '2px solid transparent',
							transition: 'border 0.3s ease',
						}}>
						<Image
							src={img}
							alt={`Thumb ${idx + 1}`}
							fill
							style={{ objectFit: 'cover', filter: selectedIndex !== idx ? 'brightness(0.5)' : 'none' }}
						/>
					</Box>
				))}
			</Stack>
		</Stack>
	);
};

export default CarouselImages;
