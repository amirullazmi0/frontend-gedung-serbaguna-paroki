'use client';
import React, { useEffect, useState } from 'react';
import { Stack, TextField, Button, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { colorPallete } from '@/app/utils/colorspallete';
import { useRouter } from 'next/navigation';
import { InferType } from 'yup';
import { forgetPasswordSchema } from '@/app/hook/auth/authConfig';
import { Alert, AlertType } from '@/app/components/Alert/Alert';
import { useForgetPassword } from '@/app/hook/auth/useAuthMutation';
import { AxiosError } from 'axios';
import { ErrorData } from '@/app/utils/globalsApiResponse';

const FormForgetPassword = () => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<InferType<typeof forgetPasswordSchema>>({
		resolver: yupResolver(forgetPasswordSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
		},
	});

	const navigatiom = useRouter();
	const [alertShow, setAlertShow] = useState(false);
	const [alertMessage, setAlertMessage] = useState<React.ReactNode>('');
	const [alertType, setAlertType] = useState<AlertType>('success');
	const [showTime, setShowTime] = useState<number>(4000);
	const { mutateAsync: forgetPassword, isPending, isSuccess, isError, error, data } = useForgetPassword();

	const onSubmit = async (data: InferType<typeof forgetPasswordSchema>) => {
		const formData = { ...data, email: data.email.toLowerCase() };
		await forgetPassword(formData);
	};

	useEffect(() => {
		if (isSuccess) {
			if (data.success) {
				setAlertType('success');
				setAlertMessage(
					<>
						<Stack gap={1}>
							<Typography textAlign={'center'}>Email Lupa Password Berhasil dikirim</Typography>
							<Typography textAlign={'center'}>Silahkan cek email</Typography>
						</Stack>
					</>
				);
				setShowTime(10000);
				setAlertShow(true);
				setTimeout(() => {
					navigatiom.push('/auth/login');
				}, showTime - 1000);
			} else {
				setAlertType('error');
				setAlertMessage(data.message);
				setShowTime(4000);
				setAlertShow(true);
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
				variant='h5'
				fontWeight={600}
				sx={{
					color: colorPallete.primary,
				}}>
				Lupa Password?
			</Typography>

			<Typography fontWeight={100}>Masukkan email yang terdaftar</Typography>
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

			<Button
				type='submit'
				loading={isPending}
				variant='contained'
				disabled={!isValid}
				fullWidth>
				Submit
			</Button>

			<hr style={{ margin: '20px 10px' }} />

			<Button
				size='small'
				color='success'
				variant='contained'
				onClick={() => navigatiom.push('/auth/login')}
				disableElevation
				sx={{
					textTransform: 'none',
				}}>
				Kembali Ke Login
			</Button>
		</Stack>
	);
};

export default FormForgetPassword;
