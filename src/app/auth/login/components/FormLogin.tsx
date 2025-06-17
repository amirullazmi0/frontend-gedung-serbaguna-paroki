'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Stack, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { colorPallete } from '@/app/utils/colorspallete';
import { useRouter } from 'next/navigation';
import { InferType } from 'yup';
import { Alert, AlertType } from '@/app/components/Alert/Alert';
import { useLogin } from '@/app/hook/auth/useAuthMutation';
import { loginSchema } from '@/app/hook/auth/authConfig';
import { AxiosError } from 'axios';
import { ErrorData } from '@/app/utils/globalsApiResponse';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { authContext } from '@/app/provider/auth-provider/authProvider';

const FormLogin = () => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<InferType<typeof loginSchema>>({
		resolver: yupResolver(loginSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const { checkAuth } = useContext(authContext);

	const [showPassword, setShowPassword] = useState(false);
	const [alertShow, setAlertShow] = useState(false);
	const [alertMessage, setAlertMessage] = useState<React.ReactNode>('');
	const [alertType, setAlertType] = useState<AlertType>('success');
	const [showTime, setShowTime] = useState<number>(4000);
	const { mutateAsync: login, isPending, isSuccess, isError, error, data } = useLogin();

	const navigation = useRouter();

	useEffect(() => {
		if (isSuccess) {
			if (data.success) {
				setAlertType('success');
				setAlertMessage('Login Berhasil');
				setShowTime(4000);
				setAlertShow(true);
				setTimeout(() => {
					if (data.data?.role) {
						checkAuth();
						const role = data.data?.role.toLowerCase();
						navigation.push(`/${role}`);
					}
				}, showTime - 1000);
			} else {
				if (data.message == 'user not active') {
					setAlertType('error');
					setAlertMessage(
						<Stack
							gap={1}
							justifyContent={'center'}
							alignItems={'center'}>
							<Typography>Akun anda belum aktif</Typography>
							<Button
								variant='contained'
								onClick={() => navigation.push('/auth/activation-request')}
								sx={{
									backgroundColor: colorPallete.primary,
									width: 'fit-content',
								}}>
								Aktivasi Sekarang
							</Button>
						</Stack>
					);
					setShowTime(20000);
					setAlertShow(true);
				}
			}
			reset();
		}

		if (isError) {
			const err: AxiosError = error as AxiosError;
			const errorData: ErrorData = err.response?.data as ErrorData;
			setAlertType('error');
			setAlertMessage(errorData.message || 'Login Failed');
			setShowTime(4000);
			setAlertShow(true);
		}
	}, [isSuccess, isError, error, reset, data]);

	const onSubmit = async (data: InferType<typeof loginSchema>) => {
		const formData = { ...data, email: data.email.toLowerCase() };
		await login(formData);
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
				gap: 2,
			}}>
			<Alert
				type={alertType}
				open={alertShow}
				onClose={() => setAlertShow(false)}
				message={alertMessage}
				timeout={showTime}
			/>

			<Typography
				variant='h3'
				fontWeight={600}
				sx={{
					color: colorPallete.primary,
				}}>
				LOGIN
			</Typography>
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

			<Controller
				name='password'
				control={control}
				render={({ field }) => (
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
										onClick={() => setShowPassword(prev => !prev)}
										edge='end'>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				)}
			/>

			<Button
				type='submit'
				loading={isPending}
				variant='contained'
				disabled={!isValid}
				fullWidth>
				Login
			</Button>

			<Button
				variant='text'
				loading={isPending}
				onClick={() => navigation.push('/auth/forget-password')}
				sx={{ padding: 0, margin: 0, width: 'fit-content', textTransform: 'none' }}>
				<Typography
					variant='body2'
					sx={{
						textAlign: 'center',
						color: colorPallete.primary,
					}}>
					Lupa Password?
				</Typography>
			</Button>
			<hr style={{ margin: '20px 10px' }} />

			<Stack
				direction={'row'}
				justifyContent={'center'}
				alignItems={'center'}
				gap={1}>
				<Typography variant='body2'>Belum Punya Akun? </Typography>
				<Button
					variant='contained'
					size='small'
					color='warning'
					onClick={() => navigation.push('/auth/register')}
					disableElevation
					sx={{
						textTransform: 'none',
					}}>
					Register
				</Button>
			</Stack>

			<Button
				size='small'
				color='success'
				variant='contained'
				onClick={() => navigation.push('/')}
				disableElevation
				sx={{
					textTransform: 'none',
				}}>
				Kembali Ke Maps
			</Button>
		</Stack>
	);
};

export default FormLogin;
