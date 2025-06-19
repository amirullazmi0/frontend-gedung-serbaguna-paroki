'use client';
import { UserType } from '@/app/DTO/user';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import React, { useEffect, useState } from 'react';
import { Button, Box, CircularProgress, Stack, Snackbar, Alert, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface Props {
	user?: UserType;
}

const ChangePhotoProfile: React.FC<Props> = ({ user }) => {
	const [preview, setPreview] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar visibility

	useEffect(() => {
		if (user?.userPhoto?.url) {
			setPreview(user.userPhoto.url); // Set initial preview from user photo
		}
	}, [user?.userPhoto?.url]);

	const { mutateAsync: savePhoto, isPending } = useMutationApiRequest<GlobalApiResponse<{ url: string }>, FormData>({
		key: 'update-user-photo',
		authRequired: true,
	});

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			setSelectedFile(file);
			const objectUrl = URL.createObjectURL(file);
			setPreview(objectUrl); // Set the preview for the selected image
		}
	};

	const handleSave = async () => {
		if (selectedFile) {
			const formData = new FormData();
			formData.append('image', selectedFile);

			try {
				const response = await savePhoto(formData);
				if (response.data) {
					setPreview(response.data.url); // Update preview with the saved URL
					setSnackbarOpen(true); // Open snackbar on success
				}
			} catch (error) {
				console.error('Error uploading photo:', error);
			}
		}
	};

	const handleIconClick = () => {
		document.getElementById('fileInput')?.click(); // Trigger the file input when clicking the camera icon
	};

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false); // Close the snackbar when the user clicks away
	};

	return (
		<Stack
			justifyContent={'center'}
			alignItems={'center'}
			sx={{ width: '100%', padding: 2 }}>
			<Stack sx={{ position: 'relative', width: '150px', height: '150px' }}>
				{/* Show preview image */}
				{preview ? (
					<img
						src={preview}
						alt='Preview'
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							borderRadius: '50%',
							cursor: 'pointer',
						}}
						onClick={handleIconClick} // Trigger the file input on image click
					/>
				) : (
					<Stack
						sx={{
							width: '100%',
							height: '100%',
							backgroundColor: '#e0e0e0',
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
						}}
						onClick={handleIconClick}>
						<PhotoCameraIcon />
					</Stack>
				)}

				{/* Camera Icon placed on top of the image */}
				<PhotoCameraIcon
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						color: preview ? 'white' : 'black', // White if there's a preview, black if not
						zIndex: 10, // Ensure the icon stays on top
						cursor: 'pointer', // Ensure the icon is clickable
					}}
					onClick={handleIconClick} // Trigger file input on icon click
				/>

				{/* Hidden file input */}
				<input
					type='file'
					id='fileInput'
					accept='image/*'
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						opacity: 0, // Make input invisible
						cursor: 'pointer', // Make input clickable
					}}
					onChange={handleFileChange}
				/>
			</Stack>

			{/* Save Button */}
			{preview && preview !== user?.userPhoto?.url && (
				<Button
					variant='contained'
					onClick={handleSave}
					disabled={isPending}
					sx={{ marginTop: '10px' }}>
					{isPending ? <CircularProgress size={24} /> : 'Save'}
				</Button>
			)}

			{/* Snackbar to show success message */}
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
				<Alert
					onClose={handleCloseSnackbar}
					severity='success'
					sx={{ width: '100%' }}>
					Photo berhasil diperbarui!
				</Alert>
			</Snackbar>
		</Stack>
	);
};

export default ChangePhotoProfile;
