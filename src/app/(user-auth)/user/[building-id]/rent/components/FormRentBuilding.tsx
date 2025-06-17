'use client';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InferType } from 'yup';
import { rentBuildingConfigSchema } from './RentBuildingConfig';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import { ErrorData, GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { BuildingItemType } from '@/app/DTO/building';
import { Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import CarouselImages from '@/app/components/Carousel/CarouselImages';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Alert, AlertType } from '@/app/components/Alert/Alert';
import { AxiosError } from 'axios';
import { colorPallete } from '@/app/utils/colorspallete';
import { formatRupiah } from '@/app/utils/formatCurency';

type RentBuildingPayload = {
	buildingId: string;
	startDate: string;
	endDate: string;
	supportDocumentRequirements: {
		supportDocumentId: string;
		documentUrl: string;
	}[];
};

const FormRentBuilding = () => {
	const buildingId = useParams()['building-id'] as string;
	const router = useRouter();

	const { data } = useQueryApiRequest<GlobalApiResponse<BuildingItemType>>({
		key: 'get-building',
		withAuth: false,
		params: { id: buildingId },
	});

	const { mutateAsync: saveDocument } = useMutationApiRequest<GlobalApiResponse<{ url: string }>, FormData>({
		key: 'post-rent-document',
		authRequired: true,
	});

	const {
		mutateAsync: createRent,
		isPending,
		isSuccess,
		isError,
		error,
	} = useMutationApiRequest<GlobalApiResponse<any>, RentBuildingPayload>({
		key: 'create-rent-building',
		authRequired: true,
	});

	const building = data?.data;
	const documentRequirement = building?.supportDocumentRequirement;

	const form = useForm<InferType<typeof rentBuildingConfigSchema>>({
		resolver: yupResolver(rentBuildingConfigSchema),
		defaultValues: {
			buildingId: buildingId,
			startDate: dayjs(),
			endDate: dayjs(),
			supportDocumentRequirements: [],
		},
	});

	const [isUploading, setIsUploading] = useState<boolean[]>([]);
	const [alertShow, setAlertShow] = useState(false);
	const [alertMessage, setAlertMessage] = useState<React.ReactNode>('');
	const [alertType, setAlertType] = useState<AlertType>('success');
	const [showTime, setShowTime] = useState<number>(4000);

	useEffect(() => {
		if (documentRequirement) {
			form.reset({
				buildingId: buildingId,
				startDate: dayjs(),
				endDate: dayjs(),
				supportDocumentRequirements: documentRequirement.map(doc => ({
					supportDocumentId: doc.id,
					documentUrl: '',
				})),
			});
			setIsUploading(Array(documentRequirement.length).fill(false));
		}
	}, [documentRequirement]);

	const { control, handleSubmit, formState } = form;

	const onSubmit = async (data: InferType<typeof rentBuildingConfigSchema>) => {
		const formatted: RentBuildingPayload = {
			...data,
			startDate: data.startDate.toISOString(),
			endDate: data.endDate.toISOString(),
		};

		await createRent(formatted);
	};

	useEffect(() => {
		if (isSuccess) {
			setAlertType('success');
			setAlertMessage('Peminjaman berhasil dibuat');
			setAlertShow(true);
			setTimeout(() => {
				router.push('/user');
			}, showTime - 1000);
		}

		if (isError) {
			const err = error as AxiosError;
			const errorData = err.response?.data as ErrorData;
			setAlertType('error');
			setAlertMessage(errorData?.message || 'Terjadi kesalahan');
			setAlertShow(true);
		}
	}, [isSuccess, isError, error]);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Alert
				open={alertShow}
				type={alertType}
				message={alertMessage}
				timeout={showTime}
				onClose={() => setAlertShow(false)}
			/>

			<Stack
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
					gap: 2,
					p: 2,
				}}>
				{/* Left: Info Gedung */}
				<Stack gap={2}>
					<CarouselImages images={building?.buildingPhoto?.map(p => p.url) ?? []} />
					<Typography variant='h6'>{building?.name}</Typography>
					<Typography>Harga: {formatRupiah(building?.price ?? 0)}</Typography>
					<Typography sx={{ whiteSpace: 'pre-wrap' }}>{building?.description}</Typography>

					<Typography variant='subtitle1'>Alamat Gedung:</Typography>
					<Stack
						p={2}
						gap={2}
						border={`1px solid ${colorPallete['low-grey']}`}>
						<Typography>Jalan : {building?.buildingAddress[0].jalan}</Typography>
						<Typography>RT : {building?.buildingAddress[0].rt}</Typography>
						<Typography>RW : {building?.buildingAddress[0].rw}</Typography>
						<Typography>Kelurahan : {building?.buildingAddress[0].kelurahan}</Typography>
						<Typography>Kecamatan : {building?.buildingAddress[0].kecamatan}</Typography>
						<Typography>Kota : {building?.buildingAddress[0].kota}</Typography>
						<Typography>Provinsi : {building?.buildingAddress[0].provinsi}</Typography>
						<Typography>Kode Pos : {building?.buildingAddress[0].kodepos}</Typography>
					</Stack>

					<Typography variant='subtitle1'>Penyedia Gedung:</Typography>
					<Stack
						p={2}
						gap={2}
						border={`1px solid ${colorPallete['low-grey']}`}>
						<Typography>Nama: {building?.user?.name}</Typography>
						<Typography>Kontak: {building?.user?.phone}</Typography>
						<Typography>Email: {building?.user?.email}</Typography>
					</Stack>
				</Stack>

				{/* Right: Form */}
				<Stack
					component='form'
					onSubmit={handleSubmit(onSubmit)}
					gap={2}
					p={2}
					sx={{ border: '1px solid #ddd', borderRadius: 2 }}>
					<Typography variant='h6'>Form Peminjaman</Typography>

					<Controller
						name='eventName'
						control={control}
						render={({ field }) => (
							<Stack>
								<Typography>Nama Kegiatan</Typography>
								<TextField
									{...field}
									fullWidth
									helperText={formState.errors.startDate?.message}
									error={!!formState.errors.startDate}
								/>
							</Stack>
						)}
					/>

					<Controller
						name='startDate'
						control={control}
						render={({ field }) => (
							<Stack>
								<Typography>Tanggal Mulai</Typography>
								<DatePicker
									value={field.value}
									onChange={field.onChange}
								/>
							</Stack>
						)}
					/>

					<Controller
						name='endDate'
						control={control}
						render={({ field, fieldState }) => (
							<Stack>
								<Typography>Tanggal Selesai</Typography>
								<DatePicker
									value={field.value}
									onChange={field.onChange}
								/>
								{fieldState.error?.message && (
									<Typography
										variant='caption'
										color='error'>
										{fieldState.error.message}
									</Typography>
								)}
							</Stack>
						)}
					/>

					<Typography variant='subtitle1'>Dokumen Pendukung</Typography>
					{documentRequirement?.map((doc, index) => (
						<Controller
							key={doc.id}
							name={`supportDocumentRequirements.${index}.documentUrl`}
							control={control}
							render={({ field, fieldState }) => (
								<Stack
									p={2}
									gap={1}
									sx={{
										border: '1px solid #ccc',
										borderRadius: 2,
										bgcolor: '#fafafa',
										mb: 1,
									}}>
									<Typography>{doc.name}</Typography>
									<Button
										variant='outlined'
										href={doc.templateDocumentUrl}
										sx={{
											width: 'fit-content',
										}}
										target='_blank'>
										Lihat Template
									</Button>

									<Stack
										direction='row'
										gap={2}
										alignItems='center'>
										<Button
											variant='contained'
											component='label'
											sx={{
												minWidth: '150px',
											}}
											disabled={isUploading[index]}>
											{isUploading[index] ? 'Mengunggah...' : 'Pilih File'}
											<input
												type='file'
												hidden
												accept='application/pdf'
												onChange={async e => {
													const file = e.target.files?.[0];
													if (!file) return;

													const formData = new FormData();
													formData.append('file', file);

													const newUploading = [...isUploading];
													newUploading[index] = true;
													setIsUploading(newUploading);

													try {
														const res = await saveDocument(formData);
														if (res.data?.url) field.onChange(res.data.url);
													} catch (err) {
														console.error(err);
													} finally {
														newUploading[index] = false;
														setIsUploading([...newUploading]);
													}
												}}
											/>
										</Button>

										{isUploading[index] && <CircularProgress size={20} />}
										{field.value && (
											<Typography
												variant='body2'
												color='textSecondary'
												sx={{ wordBreak: 'break-word' }}>
												{field.value}
											</Typography>
										)}
									</Stack>

									{fieldState.error?.message && (
										<Typography
											variant='caption'
											color='error'>
											{fieldState.error.message}
										</Typography>
									)}
								</Stack>
							)}
						/>
					))}

					<Button
						type='submit'
						variant='contained'>
						{isPending ? 'Menyimpan...' : 'Kirim Peminjaman'}
					</Button>
				</Stack>
			</Stack>
		</LocalizationProvider>
	);
};

export default FormRentBuilding;
