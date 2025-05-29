'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { buildingItemType } from '@/app/DTO/building';

interface DetailModalProps {
	open: boolean;
	onClose: () => void;
	data?: buildingItemType;
}

const DetailModal: React.FC<DetailModalProps> = ({ open, data, onClose }) => {
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
			<DialogContent>
				<DialogContentText>{data?.description}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Tutup</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DetailModal;
