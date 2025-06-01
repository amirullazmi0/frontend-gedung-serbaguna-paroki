'use client';
import React from 'react';
import { Stack, TextField, Button, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { colorPallete } from '@/app/utils/colorspallete';
import { useRouter } from 'next/navigation';
import { InferType } from 'yup';
import { forgetPasswordSchema } from './forgetPasswordConfig';

const FormForgetPassword = () => {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<InferType<typeof forgetPasswordSchema>>({
		resolver: yupResolver(forgetPasswordSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
		},
	});

	const navigatiom = useRouter();

	const onSubmit = (data: InferType<typeof forgetPasswordSchema>) => {
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
				gap: 2,
			}}>
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
				variant='contained'
				disabled={!isValid}
				fullWidth>
				Submit
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
