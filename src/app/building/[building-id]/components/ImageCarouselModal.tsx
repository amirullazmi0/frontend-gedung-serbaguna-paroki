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
		if (!open || typeof window === 'undefined') return; // Ensure this only runs in the client

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
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque ut ratione suscipit veritatis enim, cum nam. Nostrum, totam nulla, consequatur minus ipsum, dolore ipsa aspernatur culpa at
				cupiditate modi tempora.
			</DialogContent>
		</Dialog>
	);
};

export default ImageCarouselModal;
