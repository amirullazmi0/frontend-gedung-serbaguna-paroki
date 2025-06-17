import React, { useEffect, useState } from 'react';
import { Stack, Button, IconButton, Box, CircularProgress, Typography, Skeleton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Image from 'next/image';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { set, useFormContext } from 'react-hook-form';
import { InferType } from 'yup';
import { colorPallete } from '@/app/utils/colorspallete';
import { UpdateItemBuildingRequestSchema } from '../../../buildingConfig';
import { BuildingItemType } from '@/app/DTO/building';

interface FormEditSelectPhotoProps {
	id: string;
	url: string;
	loading: boolean;
}

interface Props {
	building?: BuildingItemType;
}

const FormEditSelectPhoto: React.FC<Props> = ({ building }) => {
	const [images, setImages] = useState<FormEditSelectPhotoProps[]>([]);
	const [uploading, setUploading] = useState(false); // State for upload status
	const { mutateAsync: saveImage } = useMutationApiRequest<GlobalApiResponse<{ url: string }>, FormData>({
		key: 'post-building-photo',
		authRequired: true,
	});

	const form = useFormContext<InferType<typeof UpdateItemBuildingRequestSchema>>();
	const { setValue, watch } = form;

	const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			setUploading(true);

			const newImages: FormEditSelectPhotoProps[] = [...images];

			// Loop through all selected files and add them to the preview first
			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				// Create an object URL for preview before upload
				const objectURL = URL.createObjectURL(file);

				// Add each file to the images array with `loading: true`
				newImages.push({ url: objectURL, loading: true, id: '' });
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
			setValue(
				'photo',
				newImages.map(image => ({ url: image.url, id: '' }))
			);
		}
	};

	useEffect(() => {
		if (building) {
			const photos: FormEditSelectPhotoProps[] =
				building.buildingPhoto && building.buildingPhoto.length > 0
					? building.buildingPhoto.map(photo => ({
							id: photo.id || '',
							url: photo.url || '',
							loading: false,
					  }))
					: [{ id: '', url: '', loading: false }]; // Default photo with loading set to false if no photos are available

			setImages(photos);
			setValue('photo', photos); // Set the value of `photo` with the correct structure
		}
	}, [building]);

	const handleImageRemove = (index: number) => {
		const updatedImages = images.filter((_, i) => i !== index);
		setImages(updatedImages);
		setValue('photo', updatedImages);
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
					'Tambah Foto'
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
			{watch('photo') ? (
				<Typography></Typography>
			) : (
				<Typography
					color={colorPallete.error}
					fontSize={'10px'}>
					*Foto gedung tidak boleh kosong
				</Typography>
			)}
		</Stack>
	);
};

export default FormEditSelectPhoto;
