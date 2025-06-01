'use client';
import React, { useState } from 'react';
import { Stack, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { colorPallete } from '@/app/utils/colorspallete';
import { useRouter } from 'next/navigation';
import { InferType } from 'yup';
import { newPasswordSchema } from './forgetPasswordConfig';
import PasswordChecklist from '@/app/components/PasswordCheckList';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { generatePassword } from '@/app/utils/generatePassword';

const FormNewPassword = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const toggleShowPassword = () => setShowPassword(prev => !prev);
	const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);
	const {
		control,
		handleSubmit,
		setValue,
		trigger,
		formState: { errors, isValid },
	} = useForm<InferType<typeof newPasswordSchema>>({
		resolver: yupResolver(newPasswordSchema),
		mode: 'onChange',
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const navigatiom = useRouter();

	const onSubmit = (data: InferType<typeof newPasswordSchema>) => {
		console.log('Form Data:', data);
		// Handle login logic here
	};

	return (
		<Stack
			component='form'
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				padding: 7,
				borderRadius: 8,
				boxShadow: '0px 0px 20px -5px rgba(0, 0, 0, 0.25)',
				bgcolor: colorPallete.white,
				maxWidth: {
					xs: '95vw',
					sm: '40vw',
				},
				minWidth: {
					xs: '90vw',
					sm: '30vw',
				},
				margin: 'auto',
				gap: 5,
			}}>
			<Typography
				variant='h4'
				fontWeight={600}
				sx={{
					color: colorPallete.primary,
				}}>
				Reset Password
			</Typography>

			<Stack gap={3}>
				<Controller
					name='password'
					control={control}
					render={({ field }) => (
						<Stack>
							<TextField
								{...field}
								label='Password'
								type={showPassword ? 'text' : 'password'}
								error={!!errors.password}
								fullWidth
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
					control={control}
					render={({ field }) => (
						<Stack>
							<TextField
								{...field}
								label='Konfirmasi Password'
								type={showConfirmPassword ? 'text' : 'password'}
								error={!!errors.confirmPassword}
								helperText={errors.confirmPassword?.message}
								fullWidth
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
						</Stack>
					)}
				/>
				<Button
					variant='contained'
					color='secondary'
					onClick={() => {
						const password = generatePassword(14);
						setShowPassword(true);
						setShowConfirmPassword(true);
						setValue('password', password);
						setValue('confirmPassword', password);
						trigger(['password', 'confirmPassword']);
					}}
					sx={{
						gridColumn: { xs: 'span 1', md: 'span 2' },
						width: 'fit-content',
					}}>
					Generate Password
				</Button>
			</Stack>

			<Button
				sx={{ mt: 5 }}
				type='submit'
				variant='contained'
				disabled={!isValid}
				fullWidth>
				Submit
			</Button>
		</Stack>
	);
};

export default FormNewPassword;
