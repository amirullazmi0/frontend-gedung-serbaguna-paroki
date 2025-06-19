'use client';
import PasswordChecklist from '@/app/components/PasswordCheckList';
import { UserType } from '@/app/DTO/user';
import useMutationApiRequest from '@/app/hook/useMutationApiRequest';
import { generatePassword } from '@/app/utils/generatePassword';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Button, Divider, IconButton, InputAdornment, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

interface Props {
	user?: UserType; // Replace 'any' with the actual type of user if available
}

const newPasswordSchema = yup.object({
	password: yup
		.string()
		.required('Password wajib diisi')
		.min(8, 'Password harus memiliki minimal 8 karakter')
		.matches(/[A-Z]/, 'Password harus mengandung huruf besar')
		.matches(/[a-z]/, 'Password harus mengandung huruf kecil')
		.matches(/\d/, 'Password harus mengandung angka'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'Konfirmasi Password harus sama dengan Password')
		.required('Konfirmasi Password wajib diisi'),
});

const ChangeNewPassword: React.FC<Props> = ({ user }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const toggleShowPassword = () => setShowPassword(prev => !prev);
	const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);
	const [snackbarOpen, setSnackbarOpen] = React.useState(false); // State for
	const [alertType, setAlertType] = React.useState<'success' | 'error'>('success'); // State for alert type
	const [alertMessage, setAlertMessage] = React.useState<string>(''); // State for alert message

	// Initialize form with validation schema
	const form = useForm<yup.InferType<typeof newPasswordSchema>>({
		resolver: yupResolver(newPasswordSchema),
		mode: 'onChange',
	});

	const {
		mutateAsync: saveNewPassword,
		isPending,
		isError,
		error,
	} = useMutationApiRequest<GlobalApiResponse<{ id: string }>, yup.InferType<typeof newPasswordSchema>>({
		key: 'update-user-password',
		authRequired: true,
	});

	const onSubmit = async (data: yup.InferType<typeof newPasswordSchema>) => {
		try {
			const response = await saveNewPassword(data);
			if (response.data) {
				setAlertType('success');
				setAlertMessage('Password updated successfully');
				setSnackbarOpen(true); // Show snackbar on success
				console.log('Password updated successfully:', response.data);
			}
		} catch (error) {
			console.error('Error updating password:', error);
			setAlertType('error');
			setAlertMessage('Failed to update password');
			setSnackbarOpen(true); // Show snackbar on error
		}
	};

	return (
		<Stack
			component='form'
			onSubmit={form.handleSubmit(onSubmit)}
			gap={2}
			sx={{ width: '100%' }}>
			<Typography>Password Baru</Typography>
			<Divider />
			<Stack
				gap={2}
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
				}}>
				<Controller
					name='password'
					control={form.control}
					render={({ field, fieldState }) => (
						<Stack>
							<TextField
								{...field}
								label='Password'
								type={showPassword ? 'text' : 'password'}
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
								fullWidth
								InputLabelProps={{ shrink: true }}
								InputProps={{
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton
												onClick={toggleShowPassword}
												edge='end'>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
							<PasswordChecklist password={field.value || ''} />
						</Stack>
					)}
				/>

				{/* Confirm Password with show/hide toggle */}
				<Controller
					name='confirmPassword'
					control={form.control}
					render={({ field }) => (
						<TextField
							{...field}
							label='Konfirmasi Password'
							type={showConfirmPassword ? 'text' : 'password'}
							error={!!form.formState.errors.confirmPassword}
							helperText={form.formState.errors.confirmPassword?.message}
							fullWidth
							InputLabelProps={{ shrink: true }}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton
											onClick={toggleShowConfirmPassword}
											edge='end'>
											{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
				<Button
					variant='contained'
					color='secondary'
					onClick={() => {
						const password = generatePassword(14);
						setShowPassword(true);
						setShowConfirmPassword(true);
						form.setValue('password', password);
						form.setValue('confirmPassword', password);
						form.trigger(['password', 'confirmPassword']);
					}}>
					Generate Password
				</Button>
			</Stack>
			<Button
				type='submit'
				variant='contained'
				color='primary'
				disabled={isPending}>
				{isPending ? 'Updating...' : 'Update Password'}
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

export default ChangeNewPassword;
