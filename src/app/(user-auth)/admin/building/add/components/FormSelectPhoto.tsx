import React, { useEffect, useState } from 'react';
import { Stack, Button, IconButton, Box, CircularProgress, Typography, Skeleton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Image from 'next/image';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';

interface FormSelectPhotoProps {
	url: string;
	loading: boolean;
}

interface Props {
	onChange: (e: { url: string }[]) => void; // Accept only the array of objects with `url` property
}
const FormSelectPhoto: React.FC<Props> = ({ onChange }) => {
	const [images, setImages] = useState<FormSelectPhotoProps[]>([]);
	const [uploading, setUploading] = useState(false); // State for upload status
	const {
		mutateAsync: saveImage,
		isPending,
		data,
	} = useMutationApiRequest<GlobalApiResponse<{ url: string }>, FormData>({
		key: 'post-building-photo',
		authRequired: true,
	});

	const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			setUploading(true);

			const newImages: FormSelectPhotoProps[] = [...images];

			// Loop through all selected files and add them to the preview first
			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				// Create an object URL for preview before upload
				const objectURL = URL.createObjectURL(file);

				// Add each file to the images array with `loading: true`
				newImages.push({ url: objectURL, loading: true });
			}

			setImages([...newImages]);

			// Upload the images
			for (let i = images.length; i < newImages.length; i++) {
				const file = files[i - images.length];

				try {
					const formData = new FormData();
					formData.append('file', file);

					const response = await saveImage(formData);

					if (response.data?.url) {
						newImages[i].url = response.data.url;
						newImages[i].loading = false;
						setImages([...newImages]);
					}
				} catch (error) {
					console.error('Error uploading image:', error);
				}
			}

			setUploading(false);
			onChange(newImages.map(image => ({ url: image.url })));
		}
	};

	// Only trigger onChange when the images array is fully updated

	const handleImageRemove = (index: number) => {
		const updatedImages = images.filter((_, i) => i !== index);
		setImages(updatedImages);
	};

	return (
		<Stack spacing={2}>
			<Button
				variant='contained'
				component='label'
				disabled={uploading}>
				{uploading ? (
					<CircularProgress
						size={24}
						color='inherit'
					/>
				) : (
					'Upload Images'
				)}
				<input
					type='file'
					accept='image/*'
					multiple
					hidden
					onChange={handleImageChange}
				/>
			</Button>

			<Stack
				direction='row'
				gap={1}
				flexWrap='wrap'
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: 'repeat(3, 1fr)',
						md: 'repeat(4, 1fr)',
						lg: 'repeat(5, 1fr)',
					},
				}}>
				{images.map((image, index) => (
					<Box
						key={index}
						position='relative'
						sx={{
							aspectRatio: '1/1',
							width: '100%',
							borderRadius: 2,
							overflow: 'hidden',
						}}>
						{image.loading ? (
							<Skeleton
								variant='rectangular'
								width='100%'
								height='100%'
								sx={{
									position: 'absolute',
									top: 0,
									left: 0,
								}}
							/>
						) : (
							<Image
								src={image.url || ''}
								alt={`preview-${index}`}
								layout='fill'
								objectFit='cover'
							/>
						)}
						<IconButton
							size='small'
							onClick={() => handleImageRemove(index)}
							style={{
								position: 'absolute',
								top: '0',
								right: '0',
								margin: 2,
								backgroundColor: 'rgba(255, 255, 255, 0.5)',
								borderRadius: '50%',
							}}>
							<Close fontSize='small' />
						</IconButton>
					</Box>
				))}
			</Stack>

			{isPending && (
				<Typography
					variant='body2'
					color='textSecondary'>
					Uploading...
				</Typography>
			)}
		</Stack>
	);
};

export default FormSelectPhoto;
