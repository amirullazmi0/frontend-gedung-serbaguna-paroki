'use client';
import * as yup from 'yup';
import { UserType } from '@/app/DTO/user';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Divider, Snackbar, Stack, TextField, Typography } from '@mui/material';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';

interface Props {
	user?: UserType;
}

const changeAddressSchema = yup.object({
	jalan: yup.string().required('Jalan is required'),
	rt: yup.string().required('RT is required'),
	rw: yup.string().required('RW is required'),
	kelurahan: yup.string().required('Kelurahan is required'),
	kecamatan: yup.string().required('Kecamatan is required'),
	kota: yup.string().required('Kota is required'),
	provinsi: yup.string().required('Provinsi is required'),
	kodepos: yup.string().required('Kodepos is required'),
});

const ChangeAddress: React.FC<Props> = ({ user }) => {
	const form = useForm<yup.InferType<typeof changeAddressSchema>>({
		resolver: yupResolver(changeAddressSchema),
		mode: 'onChange',
	});

	React.useEffect(() => {
		form.reset({
			jalan: user?.userAddress.jalan || '',
			rt: user?.userAddress.rt || '',
			rw: user?.userAddress.rw || '',
			kelurahan: user?.userAddress.kelurahan || '',
			kecamatan: user?.userAddress.kecamatan || '',
			kota: user?.userAddress.kota || '',
			provinsi: user?.userAddress.provinsi || '',
			kodepos: user?.userAddress.kodepos || '',
		});
	}, [user]);

	const { mutateAsync: saveAddress, isPending } = useMutationApiRequest<GlobalApiResponse<{ id: string }>, yup.InferType<typeof changeAddressSchema>>({
		key: 'update-user-address',
		authRequired: true,
	});

	const onSubmit = async (data: yup.InferType<typeof changeAddressSchema>) => {
		try {
			const response = await saveAddress(data);
			if (response.data) {
				setSnackbarOpen(true); // Show snackbar on success
				console.log('Address updated successfully:', response.data);
			}
		} catch (error) {
			console.error('Error updating address:', error);
			// Handle error, e.g., show an error message
		}
	};

	const [snackbarOpen, setSnackbarOpen] = React.useState(false);

	return (
		<Stack
			component='form'
			onSubmit={form.handleSubmit(onSubmit)}
			gap={2}>
			<Typography>Alamat</Typography>
			<Divider />
			<Stack
				gap={2}
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
				}}>
				<Controller
					name='jalan'
					control={form.control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label='Jalan'
							variant='outlined'
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
					)}
				/>
				<Controller
					name='rt'
					control={form.control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label='RT'
							variant='outlined'
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
					)}
				/>
				<Controller
					name='rw'
					control={form.control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label='RW'
							variant='outlined'
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
					)}
				/>
				<Controller
					name='kelurahan'
					control={form.control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label='Kelurahan'
							variant='outlined'
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
					)}
				/>
				<Controller
					name='kecamatan'
					control={form.control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label='Kecamatan'
							variant='outlined'
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
					)}
				/>
				<Controller
					name='kota'
					control={form.control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label='Kota'
							variant='outlined'
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
					)}
				/>
				<Controller
					name='provinsi'
					control={form.control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label='Provinsi'
							variant='outlined'
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
					)}
				/>
				<Controller
					name='kodepos'
					control={form.control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label='Kodepos'
							variant='outlined'
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
					)}
				/>
			</Stack>

			<Button
				type='submit'
				variant='contained'
				color='primary'
				disabled={isPending}>
				{isPending ? 'Updating...' : 'Update Alamat'}
			</Button>

			<Snackbar
				open={snackbarOpen}
				onClose={() => {
					setSnackbarOpen(false);
				}}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
				<Alert
					onClose={() => {
						setSnackbarOpen(false);
					}}
					severity='success'
					sx={{ width: '100%' }}>
					Alamat berhasil diperbarui!
				</Alert>
			</Snackbar>
		</Stack>
	);
};

export default ChangeAddress;
