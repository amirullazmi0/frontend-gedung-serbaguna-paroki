'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Stack, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ImageCarouselModalProps {
	open: boolean;
	images: string[];
	initialIndex?: number;
	onClose: () => void;
}

const ImageCarouselModal: React.FC<ImageCarouselModalProps> = ({ open, images, initialIndex = 0, onClose }) => {
	const [index, setIndex] = useState(initialIndex);

	useEffect(() => {
		setIndex(initialIndex);
	}, [initialIndex]);

	// Keyboard support (left/right arrows)
	useEffect(() => {
		if (!open) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') {
				setIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
			}
			if (e.key === 'ArrowRight') {
				setIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [open, images.length]);

	const handlePrev = () => {
		setIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
	};

	if (images.length === 0) {
		return null; // or a dialog saying "No images"
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='md'
			fullWidth>
			<DialogTitle sx={{ m: 0, p: 2 }}>
				Gambar Gedung
				<IconButton
					aria-label='close'
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: theme => theme.palette.grey[500],
					}}
					size='large'>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent
				dividers
				sx={{
					p: 0,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'relative',
					height: 600,
					backgroundColor: '#000',
				}}>
				<IconButton
					onClick={handlePrev}
					sx={{
						position: 'absolute',
						left: 8,
						top: '50%',
						transform: 'translateY(-50%)',
						color: 'white',
						zIndex: 10,
					}}
					size='large'
					aria-label='previous image'>
					&#8592;
				</IconButton>

				<Box
					component='img'
					src={images[index]}
					alt={`Image ${index + 1}`}
					sx={{
						maxWidth: '100%',
						maxHeight: '100%',
						objectFit: 'contain',
						userSelect: 'none',
					}}
				/>

				<IconButton
					onClick={handleNext}
					sx={{
						position: 'absolute',
						right: 8,
						top: '50%',
						transform: 'translateY(-50%)',
						color: 'white',
						zIndex: 10,
					}}
					size='large'
					aria-label='next image'>
					&#8594;
				</IconButton>
			</DialogContent>
			<Stack
				direction='row'
				justifyContent='center'
				spacing={1}
				sx={{ p: 1, bgcolor: '#f0f0f0' }}>
				{images.map((_, i) => (
					<Box
						key={i}
						onClick={() => setIndex(i)}
						sx={{
							width: 12,
							height: 12,
							borderRadius: '50%',
							bgcolor: i === index ? 'primary.main' : 'grey.400',
							cursor: 'pointer',
						}}
					/>
				))}
			</Stack>
		</Dialog>
	);
};

export default ImageCarouselModal;
