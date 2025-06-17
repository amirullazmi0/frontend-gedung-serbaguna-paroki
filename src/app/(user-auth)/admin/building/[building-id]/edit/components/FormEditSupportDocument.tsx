'use client';
import { Button, CircularProgress, IconButton, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { InferType } from 'yup';

import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { colorPallete } from '@/app/utils/colorspallete';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { UpdateItemBuildingRequestSchema } from '../../../buildingConfig';
import { BuildingItemType } from '@/app/DTO/building';

interface Props {
	building?: BuildingItemType;
}

const FormEditSupportDocument: React.FC<Props> = ({ building }) => {
	const form = useFormContext<InferType<typeof UpdateItemBuildingRequestSchema>>();
	const {
		setValue,
		watch,
		formState: { errors },
		control,
		trigger,
	} = form;

	const supportDocument = watch('supportDocumentRequirement') || [];
	const [isUploading, setIsUploading] = useState<boolean[]>(supportDocument.map(() => false));

	const { mutateAsync: saveDocument } = useMutationApiRequest<GlobalApiResponse<{ url: string }>, FormData>({
		key: 'post-building-document',
		authRequired: true,
	});

	useEffect(() => {
		// Initialize empty array if undefined
		if (!watch('supportDocumentRequirement')) {
			setValue('supportDocumentRequirement', []);
		}
	}, []);

	const addSupportDocument = () => {
		const currentDocs = watch('supportDocumentRequirement') || [];
		setValue('supportDocumentRequirement', [...currentDocs, { name: '', templateDocumentUrl: '', id: '' }]);
		setIsUploading(prev => [...prev, false]);
	};

	const removeSupportDocument = (index: number) => {
		const updated = [...supportDocument];
		updated.splice(index, 1);
		setValue('supportDocumentRequirement', updated);

		const updatedLoading = [...isUploading];
		updatedLoading.splice(index, 1);
		setIsUploading(updatedLoading);
	};

	useEffect(() => {
		if (building) {
			const documents: InferType<typeof UpdateItemBuildingRequestSchema>['supportDocumentRequirement'] =
				building.supportDocumentRequirement && building.supportDocumentRequirement.length > 0
					? building.supportDocumentRequirement
							.filter(doc => doc.templateDocumentUrl && doc.templateDocumentUrl.trim() !== '') // Filter out documents with invalid URL
							.map(doc => ({
								id: doc.id,
								name: doc.name,
								templateDocumentUrl: doc.templateDocumentUrl,
							}))
					: []; // Empty array if no valid documents

			setValue('supportDocumentRequirement', documents);
			trigger('supportDocumentRequirement');
		}
	}, [building]);

	const handleFileChange = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			const formData = new FormData();
			formData.append('file', file);

			const updatedLoading = [...isUploading];
			updatedLoading[index] = true;
			setIsUploading(updatedLoading);

			try {
				const response = await saveDocument(formData);
				if (response.data?.url) {
					const updatedDocs = [...supportDocument];
					updatedDocs[index].templateDocumentUrl = response.data.url;
					setValue('supportDocumentRequirement', updatedDocs);
				}
			} catch (error) {
				console.error('Error uploading document:', error);
			} finally {
				const updatedLoading = [...isUploading];
				updatedLoading[index] = false;
				setIsUploading(updatedLoading);
			}
		}
	};

	const isLastDocumentIncomplete = () => {
		if (supportDocument.length === 0) return false;
		const last = supportDocument[supportDocument.length - 1];
		return !last?.name?.trim() || !last?.templateDocumentUrl?.trim();
	};

	return (
		<Stack gap={2}>
			<Stack alignItems='flex-end'>
				<Button
					variant='contained'
					sx={{ width: 'fit-content' }}
					onClick={addSupportDocument}
					disabled={isLastDocumentIncomplete()}>
					<AddIcon />
					Dokumen Pendukung
				</Button>
			</Stack>

			<Stack>
				{supportDocument.map((document, index) => (
					<Stack
						key={index}
						direction='row'
						alignItems='center'
						gap={1}
						padding={1}
						sx={{
							borderRadius: 1,
							border: `2px solid ${colorPallete['low-grey']}`,
						}}>
						<Stack
							width='90%'
							gap={1}>
							<Typography>Dokumen Pendukung {index + 1}</Typography>

							<Controller
								name={`supportDocumentRequirement.${index}.name`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										label='Nama Dokumen'
										{...field}
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
									/>
								)}
							/>

							<Stack
								direction='row'
								alignItems='center'
								gap={1}
								mt={1}>
								<Button
									variant='contained'
									component='label'
									sx={{
										paddingRight: 2,
										minWidth: {
											md: '150px',
										},
									}}>
									Pilih File
									<input
										type='file'
										hidden
										accept='application/pdf'
										onChange={e => handleFileChange(index, e)}
									/>
								</Button>

								{isUploading[index] ? (
									<CircularProgress size={20} />
								) : (
									<Typography
										variant='body2'
										sx={{
											textWrap: 'wrap',
										}}
										color='textSecondary'>
										{document.templateDocumentUrl ? (document.templateDocumentUrl.length > 50 ? document.templateDocumentUrl.slice(0, 50) + '...' : document.templateDocumentUrl) : 'Belum ada file yang dipilih'}
									</Typography>
								)}
							</Stack>

							{errors.supportDocumentRequirement?.[index]?.templateDocumentUrl?.message && (
								<Typography
									variant='body2'
									color={colorPallete.error}>
									<small>{errors.supportDocumentRequirement[index].templateDocumentUrl.message}</small>
								</Typography>
							)}
						</Stack>

						<Stack width='10%'>
							<IconButton
								color='error'
								onClick={() => removeSupportDocument(index)}>
								<CloseIcon />
							</IconButton>
						</Stack>
					</Stack>
				))}
			</Stack>
		</Stack>
	);
};

export default FormEditSupportDocument;
