'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface DetailModalProps {
	open: boolean;
	name?: string;
	description?: string;
	onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ open, name, description, onClose }) => {
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
			<DialogTitle>{name}</DialogTitle>
			<DialogContent>
				<DialogContentText>{description}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Tutup</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DetailModal;
