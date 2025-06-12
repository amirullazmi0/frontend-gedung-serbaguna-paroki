import React, { useState } from 'react';
import { Stack, Button, IconButton, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import Image from 'next/image';

interface FormPhotoProps {}

const FormPhoto: React.FC<FormPhotoProps> = () => {
	// State untuk menyimpan array gambar yang diunggah
	const [images, setImages] = useState<string[]>([]);

	// Fungsi untuk menangani perubahan file input (menambahkan gambar ke array)
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const newImages: string[] = [...images];

			// Tambahkan file-file yang dipilih ke dalam array images
			for (let i = 0; i < files.length; i++) {
				newImages.push(URL.createObjectURL(files[i]));
			}

			setImages(newImages);
		}
	};

	// Fungsi untuk menghapus gambar berdasarkan index
	const handleImageRemove = (index: number) => {
		const updatedImages = images.filter((_, i) => i !== index);
		setImages(updatedImages);
	};

	return (
		<Stack spacing={2}>
			{/* Button untuk input gambar */}
			<Button
				variant='contained'
				component='label'>
				Upload Images
				<input
					type='file'
					accept='image/*'
					multiple
					hidden
					onChange={handleImageChange}
				/>
			</Button>

			{/* Preview gambar yang diunggah */}
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
						<Image
							src={image}
							alt={`preview-${index}`}
							layout='fill'
							objectFit='cover'
						/>
						{/* Tombol close untuk menghapus image */}
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
		</Stack>
	);
};

export default FormPhoto;
