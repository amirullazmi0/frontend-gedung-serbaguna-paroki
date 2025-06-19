'use client';
import * as yup from 'yup';
import React, { useEffect } from 'react';
import { UserType } from '@/app/DTO/user';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import { ErrorData, GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { Alert, Button, Divider, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { AxiosError } from 'axios';

interface Props {
	user?: UserType;
}

const changeProfileSchema = yup.object({
	name: yup.string().required('Name is required'),
	phone: yup.string().required('Phone is required'),
});
const ChangeProfile: React.FC<Props> = ({ user }) => {
	const [snackbarOpen, setSnackbarOpen] = React.useState(false); // State for snackbar visibility
	const [alertType, setAlertType] = React.useState<'success' | 'error'>('success'); // State for alert type
	const [alertMessage, setAlertMessage] = React.useState<string>(''); // State for alert message
	const form = useForm<yup.InferType<typeof changeProfileSchema>>({
		resolver: yupResolver(changeProfileSchema),
		mode: 'onChange',
	});

	const {
		mutateAsync: saveProfile,
		isPending,
		isError,
		error,
	} = useMutationApiRequest<GlobalApiResponse<{ id: string }>, yup.InferType<typeof changeProfileSchema>>({
		key: 'update-user-profile',
		authRequired: true,
	});

	useEffect(() => {
		if (isError) {
			const err: AxiosError = error as AxiosError;
			const errorData: ErrorData = err.response?.data as ErrorData;
			console.error('Error updating profile:', errorData.message);
			if (errorData.message && errorData.message == 'Phone number already exists') {
				form.setError('phone', { message: 'Phone number already exists' });
			} else {
				setAlertType('error');
				setAlertMessage(errorData.message || 'An error occurred while updating the profile.');
				setSnackbarOpen(true); // Show snackbar on error
			}
		}
	}, [isError, error]);

	useEffect(() => {
		form.reset({
			name: user?.name || '',
			phone: user?.phone || '',
		});
	}, [user]);

	const onSubmit = async (data: yup.InferType<typeof changeProfileSchema>) => {
		const response = await saveProfile(data);
		if (response.data) {
			setSnackbarOpen(true); // Show snackbar on success
			setAlertType('success');
			setAlertMessage('Profil berhasil diperbarui!'); // Set success message
			console.log('Profile updated successfully:', response.data);
		}
	};

	return (
		<Stack
			component='form'
			onSubmit={form.handleSubmit(onSubmit)}
			gap={2}
			sx={{ width: '100%' }}>
			<Typography>Profil</Typography>
			<Divider />
			<Stack
				gap={2}
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
				}}>
				<TextField
					label='Email'
					variant='outlined'
					disabled
					value={user?.email || ''}
					fullWidth
					InputLabelProps={{ shrink: true }}
				/>
				<Controller
					name='name'
					control={form.control}
					render={({ field }) => (
						<TextField
							{...field}
							label='Name'
							variant='outlined'
							error={!!form.formState.errors.name}
							helperText={form.formState.errors.name?.message}
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
					)}
				/>

				<Controller
					name='phone'
					control={form.control}
					render={({ field }) => (
						<TextField
							{...field}
							label='Phone'
							variant='outlined'
							error={!!form.formState.errors.phone}
							helperText={form.formState.errors.phone?.message}
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
				Simpan
			</Button>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={() => {
					setSnackbarOpen(false); // Close snackbar after auto-hide or manual close
				}}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
				<Alert
					onClose={() => {
						setSnackbarOpen(false); // Close snackbar after auto-hide or manual close
					}}
					severity={alertType}
					sx={{ width: '100%' }}>
					{alertMessage}
				</Alert>
			</Snackbar>
		</Stack>
	);
};

export default ChangeProfile;
