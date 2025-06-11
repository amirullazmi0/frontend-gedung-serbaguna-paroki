'use client';

import React, { useEffect, useState } from 'react';
import { Stack, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { Controller, useForm, set } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { colorPallete } from '@/app/utils/colorspallete';
import { useRouter, useSearchParams } from 'next/navigation';
import { InferType } from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PasswordChecklist from '@/app/components/PasswordCheckList';
import { generatePassword } from '@/app/utils/generatePassword';
import { registerSchema } from '@/app/hook/auth/authConfig';
import { useRegister } from '@/app/hook/auth/useAuthMutation';
import { AxiosError } from 'axios';
import { ErrorData } from '@/app/utils/globalsApiResponse';
import { Alert, AlertType } from '@/app/components/Alert/Alert';
import PhoneInput from '@/app/components/PhoneInput';

const FormRegister = () => {
	const {
		control,
		handleSubmit,
		setValue,
		reset,
		trigger,
		setError,
		formState: { errors, isValid },
	} = useForm<InferType<typeof registerSchema>>({
		resolver: yupResolver(registerSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const navigation = useRouter();
	const searchParams = useSearchParams();
	const role = searchParams.get('role');

	const [alertShow, setAlertShow] = useState(false);
	const [alertMessage, setAlertMessage] = useState<React.ReactNode>('');
	const [alertType, setAlertType] = useState<AlertType>('success');
	const timeout = 4000;
	const { mutateAsync: register, isPending, isSuccess, isError, error } = useRegister();

	// 👇 State for show/hide password
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const toggleShowPassword = () => setShowPassword(prev => !prev);
	const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

	const onSubmit = async (data: InferType<typeof registerSchema>) => {
		const formData = { ...data, email: data.email.toLowerCase() };
		await register(formData);
	};

	useEffect(() => {
		if (isSuccess) {
			setAlertType('success');
			setAlertMessage(
				<>
					<Typography>
						Registrasi berhasil <br /> Silahkan cek email anda untuk aktivasi akun
					</Typography>
				</>
			);
			setAlertShow(true);
			reset();
			setTimeout(() => {
				navigation.push('/auth/login');
			}, timeout - 1000);
		}

		if (isError) {
			const err: AxiosError = error as AxiosError;
			const errorData: ErrorData = err.response?.data as ErrorData;
			if (errorData.message == 'email is already registered') {
				setError('email', { message: 'Email sudah terdaftar' });
				return;
			}
			if (errorData.message == 'phone number is already registered') {
				setError('phone', { message: 'Nomor whatsapp sudah terdaftar' });
				return;
			}
			setAlertType('error');
			setAlertMessage(errorData.message || 'Register gagal');
			setAlertShow(true);
		}
	}, [isSuccess, isError, error, reset]);

	const CardPilihRole = () => (
		<Stack
			sx={{
				gridColumn: {
					xs: 'span 1',
					md: 'span 2',
				},
			}}>
			<Typography
				variant='h3'
				sx={{
					fontWeight: 'bold',
					color: colorPallete.primary,
				}}>
				Pilih Role
			</Typography>
			<Stack
				sx={{
					gap: 2,
					display: 'grid',
					gridTemplateColumns: 'repeat(2, 1fr)',
					mt: 10,
				}}>
				<Button
					sx={{ textTransform: 'none' }}
					variant='contained'
					size='small'
					onClick={() => navigation.push('/auth/register?role=USER')}>
					Penyewa
				</Button>
				<Button
					sx={{ textTransform: 'none' }}
					variant='contained'
					size='small'
					onClick={() => navigation.push('/auth/register?role=ADMIN')}>
					Penyedia Gedung
				</Button>
			</Stack>
		</Stack>
	);

	return (
		<Stack
			component='form'
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				padding: 7,
				borderRadius: 8,
				boxShadow: '0px 0px 20px -5px rgba(0, 0, 0, 0.25)',
				bgcolor: colorPallete.white,
				maxWidth: { xs: '95vw', md: '70vw' },
				minWidth: { xs: '90vw', md: '40vw' },
				margin: 'auto',
				gap: 2,
				display: 'grid',
				gridTemplateColumns: {
					xs: 'repeat(1, 1fr)',
					md: 'repeat(2, 1fr)',
				},
			}}>
			<Alert
				type={alertType}
				open={alertShow}
				onClose={() => setAlertShow(false)}
				message={alertMessage}
				timeout={timeout}
			/>
			{!role || (role !== 'USER' && role !== 'ADMIN') ? (
				<CardPilihRole />
			) : (
				<>
					<Typography
						variant='h3'
						fontWeight={600}
						sx={{
							color: colorPallete.primary,
							gridColumn: {
								xs: 'span 1',
								md: 'span 2',
							},
							mb: 5,
						}}>
						Register <br />
						<span style={{ color: colorPallete.black }}>{role === 'USER' ? 'Penyewa' : 'Penyedia Gedung'}</span>
					</Typography>

					{/* Name Field */}

					{/* Email Field */}
					<Controller
						name='email'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label='Email'
								type='email'
								error={!!errors.email}
								helperText={errors.email?.message}
								fullWidth
							/>
						)}
					/>

					{/* Phone Field */}
					<Controller
						name='phone'
						control={control}
						render={({ field }) => (
							<PhoneInput
								field={field}
								name='phone'
								label='Whatsapp'
								error={errors.phone?.message}
							/>
						)}
					/>

					{/* Password Field */}
					<Controller
						name='password'
						control={control}
						render={({ field }) => (
							<Stack sx={{ gridColumn: { xs: 'span 1', md: 'span 2' }, gap: 1 }}>
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

					{/* Confirm Password Field */}
					<Controller
						name='confirmPassword'
						control={control}
						render={({ field }) => (
							<Stack sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
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

					{/* Hidden role field */}
					<input
						type='hidden'
						{...control.register('role')}
						value={role}
					/>

					{/* Buttons */}
					<Stack
						flexDirection={'row'}
						gap={1}>
						<Button
							variant='contained'
							onClick={() => {
								navigation.push('/auth/register');
								reset({
									name: '',
									email: '',
									password: '',
									confirmPassword: '',
								});
							}}
							sx={{
								gridColumn: { xs: 'span 1', md: 'span 2' },
								width: 'fit-content',
							}}>
							Ubah Role
						</Button>
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
						type='submit'
						loading={isPending}
						variant='contained'
						disabled={!isValid}
						sx={{ gridColumn: { xs: 'span 1', md: 'span 2' }, mt: 5 }}>
						Register
					</Button>
				</>
			)}

			{/* Login Link */}
			<Stack
				sx={{
					gridColumn: { xs: 'span 1', md: 'span 2' },
					gap: 2,
				}}>
				<hr style={{ margin: '20px 10px' }} />
				<Stack
					direction='row'
					justifyContent='center'
					alignItems='center'
					gap={1}>
					<Typography variant='body2'>Sudah Punya Akun?</Typography>
					<Button
						variant='contained'
						size='small'
						color='warning'
						onClick={() => navigation.push('/auth/login')}
						disableElevation
						sx={{ textTransform: 'none' }}>
						Login
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default FormRegister;
