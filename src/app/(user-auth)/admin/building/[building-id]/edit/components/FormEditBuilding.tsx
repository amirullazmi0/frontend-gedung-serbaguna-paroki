'use client';
import React, { useEffect, useState } from 'react';
import { Stack, TextField, Button, Typography, InputAdornment, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { colorPallete } from '@/app/utils/colorspallete';
import { useParams, useRouter } from 'next/navigation';
import { InferType } from 'yup';
import { Alert, AlertType } from '@/app/components/Alert/Alert';
import { useLogin } from '@/app/hook/auth/useAuthMutation';
import { AxiosError } from 'axios';
import { ErrorData, GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import SelectLatLng from './SelectLatLng';
import FormSelectPhoto from './FormSelectPhoto';
import FormSupportDocument from './FormSupportDocument';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import { UpdateItemBuildingRequestSchema } from '../../../buildingConfig';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import { BuildingItemType } from '@/app/DTO/building';

const FormEditBuilding = () => {
	const buildingId = useParams()['building-id'];
	const { data: buildingResponse, isLoading } = useQueryApiRequest<GlobalApiResponse<BuildingItemType>>({
		key: 'get-admin-building',
		withAuth: true,
		params: { id: buildingId },
	});
	const building = buildingResponse?.data;

	const form = useForm<InferType<typeof UpdateItemBuildingRequestSchema>>({
		resolver: yupResolver(UpdateItemBuildingRequestSchema),
		mode: 'onChange',
	});
	const {
		control,
		handleSubmit,
		reset,
		setValue,
		trigger,
		watch,
		formState: { errors, isValid },
	} = form;

	const [alertShow, setAlertShow] = useState(false);
	const [alertMessage, setAlertMessage] = useState<React.ReactNode>('');
	const [alertType, setAlertType] = useState<AlertType>('success');
	const [showTime, setShowTime] = useState<number>(4000);
	const {
		mutateAsync: postBuilding,
		isPending,
		isSuccess,
		isError: isErrorPost,
		error: errorPost,
		data,
	} = useMutationApiRequest<GlobalApiResponse<any>, InferType<typeof UpdateItemBuildingRequestSchema>>({
		key: 'update-building',
		authRequired: true,
	});

	const navigation = useRouter();

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.between('xs', 'md'));
	const isDesktop = useMediaQuery(theme.breakpoints.up('lg')) && !isMobile;

	useEffect(() => {
		if (isSuccess) {
			setAlertType('success');
			setAlertMessage('Data Berhasil Ditambahkan');
			setShowTime(4000);
			setAlertShow(true);
			setTimeout(() => {
				navigation.push('/admin/building');
			}, showTime - 1000);
		}

		if (isErrorPost) {
			const err: AxiosError = errorPost as AxiosError;
			const errorData: ErrorData = err.response?.data as ErrorData;
			setAlertType('error');
			setAlertMessage(errorData.message || 'Terjadi Kesalahan');
			setShowTime(4000);
			setAlertShow(true);
		}
	}, [isSuccess, isErrorPost, errorPost, reset, data]);

	useEffect(() => {
		if (building) {
			setValue('id', building.id);
			setValue('name', building.name);
			setValue('address', {
				jalan: building.buildingAddress[0].jalan,
				rt: building.buildingAddress[0].rt,
				rw: building.buildingAddress[0].rw,
				kelurahan: building.buildingAddress[0].kelurahan,
				kecamatan: building.buildingAddress[0].kecamatan,
				lat: building.buildingAddress[0].lat,
				lng: building.buildingAddress[0].lng,
				kota: building.buildingAddress[0].kota,
				provinsi: building.buildingAddress[0].provinsi,
				kodepos: building.buildingAddress[0].kodepos,
			});
			setValue('description', building.description);
			setValue('price', building.price);
			setValue('photo', building.buildingPhoto);
			setValue('supportDocumentRequirement', building.supportDocumentRequirement);
			trigger();
		}
	}, [building]);

	const onSubmit = async (data: InferType<typeof UpdateItemBuildingRequestSchema>) => {
		await postBuilding(data);
	};
	return (
		<Stack
			component='form'
			onSubmit={handleSubmit(onSubmit)}
			width={'100%'}
			gap={2}
			padding={2}>
			<Alert
				type={alertType}
				open={alertShow}
				onClose={() => setAlertShow(false)}
				message={alertMessage}
				timeout={showTime}
			/>
			<Stack width={'100%'}>
				<Typography
					variant='h4'
					fontWeight={600}
					textAlign={'right'}
					sx={{
						color: colorPallete.primary,
					}}>
					UPDATE GEDUNG
				</Typography>
			</Stack>
			<FormProvider {...form}>
				<Stack
					gap={2}
					sx={{
						display: 'grid',
						gridTemplateColumns: {
							xs: 'repeat(1, 1fr)',
							md: 'repeat(2, 1fr)',
							lg: 'repeat(2, 1fr)',
						},
					}}>
					{isDesktop && (
						<Stack
							padding={2}
							gap={1}
							height={'fit-content'}
							bgcolor={colorPallete['low-grey']}
							borderRadius={2}>
							<Typography>Pilih Lokasi Gedung</Typography>
							<SelectLatLng
								lat={Number(watch('address.lat'))}
								lng={Number(watch('address.lng'))}
								onChange={e => {
									console.log('onChange', e);
									setValue('address.lat', e.lat.toString());
									setValue('address.lng', e.lng.toString());
									trigger(['address.lat', 'address.lng']);
								}}
							/>
						</Stack>
					)}
					<Stack
						gap={2}
						sx={{
							width: '100%',
							maxWidth: {
								xs: '100%',
								md: '600px',
							},
						}}>
						<Controller
							name='name'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Nama Gedung'
									variant='outlined'
									error={!!errors.name}
									helperText={errors.name?.message}
									InputLabelProps={{ shrink: true }}
								/>
							)}
						/>

						{/* Price Field */}
						<Controller
							name='price'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Harga'
									variant='outlined'
									type='number'
									InputProps={{
										startAdornment: <InputAdornment position='start'>Rp</InputAdornment>,
									}}
									error={!!errors.price}
									helperText={errors.price?.message}
									InputLabelProps={{ shrink: true }}
								/>
							)}
						/>

						{/* Description Field */}
						<Controller
							name='description'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Deskripsi'
									variant='outlined'
									multiline
									rows={4}
									error={!!errors.description}
									InputLabelProps={{ shrink: true }}
									helperText={errors.description?.message}
								/>
							)}
						/>

						<Stack
							gap={2}
							sx={{
								display: 'grid',
								gridTemplateColumns: {
									xs: 'repeat(1, 1fr)',
									md: 'repeat(2, 1fr)',
								},
							}}>
							<Controller
								name='address.jalan'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Jalan'
										variant='outlined'
										error={!!errors.address?.jalan}
										helperText={errors.address?.jalan?.message}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
							<Controller
								name='address.rt'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='RT'
										variant='outlined'
										error={!!errors.address?.rt}
										helperText={errors.address?.rt?.message}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
							<Controller
								name='address.rw'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='RW'
										variant='outlined'
										error={!!errors.address?.rw}
										helperText={errors.address?.rw?.message}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
							<Controller
								name='address.kelurahan'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Kelurahan'
										variant='outlined'
										error={!!errors.address?.kelurahan}
										helperText={errors.address?.kelurahan?.message}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
							<Controller
								name='address.kecamatan'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Kecamatan'
										variant='outlined'
										error={!!errors.address?.kecamatan}
										helperText={errors.address?.kecamatan?.message}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
							<Controller
								name='address.kota'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Kota'
										variant='outlined'
										error={!!errors.address?.kota}
										helperText={errors.address?.kota?.message}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
							<Controller
								name='address.provinsi'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Provinsi'
										variant='outlined'
										error={!!errors.address?.provinsi}
										helperText={errors.address?.provinsi?.message}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
							<Controller
								name='address.kodepos'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Kodepos'
										type='number'
										variant='outlined'
										error={!!errors.address?.kodepos}
										helperText={errors.address?.kodepos?.message}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
							<Controller
								name='address.lat'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='lat'
										defaultValue={'0'}
										disabled
										variant='outlined'
										error={!!errors.address?.lat}
										helperText={errors.address?.lat?.message}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
							<Controller
								name='address.lng'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='lng'
										disabled
										defaultValue={'0'}
										variant='outlined'
										error={!!errors.address?.lng}
										helperText={errors.address?.lng?.message}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
						</Stack>

						<FormSelectPhoto />
						<FormSupportDocument />

						{/* Submit Button */}
						<Button
							type='submit'
							variant='contained'
							color='primary'
							// disabled={!isValid}
							sx={{ mt: 2 }}>
							Submit
						</Button>
					</Stack>
				</Stack>
			</FormProvider>
		</Stack>
	);
};

export default FormEditBuilding;
