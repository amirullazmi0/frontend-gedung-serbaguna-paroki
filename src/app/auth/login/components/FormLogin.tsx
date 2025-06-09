'use client';
import React, { useEffect, useState } from 'react';
import { Stack, TextField, Button, Typography } from '@mui/material';
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

	const [alertShow, setAlertShow] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertType, setAlertType] = useState<AlertType>('success');
	const { mutateAsync: login, isPending, isSuccess, isError, error } = useLogin();

	const navigatiom = useRouter();

	useEffect(() => {
		if (isSuccess) {
			setAlertType('success');
			setAlertMessage('Login Berhasil');
			setAlertShow(true);
			reset();
		}

		if (isError) {
			const err: AxiosError = error as AxiosError;
			const errorData: ErrorData = err.response?.data as ErrorData;
			setAlertType('error');
			setAlertMessage(errorData.message || 'Login Failed');
			setAlertShow(true);
		}
	}, [isSuccess, isError, error, reset]);

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
				timeout={5000}
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
						type='password'
						error={!!errors.password}
						helperText={errors.password?.message}
						fullWidth
					/>
				)}
			/>

			<Button
				type='submit'
				variant='contained'
				disabled={!isValid}
				fullWidth>
				Login
			</Button>

			<Button
				variant='text'
				loading={isPending}
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
					onClick={() => navigatiom.push('/auth/register')}
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
				onClick={() => navigatiom.push('/')}
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
