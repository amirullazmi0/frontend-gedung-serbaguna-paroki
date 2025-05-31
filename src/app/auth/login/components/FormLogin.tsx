'use client';
import React from 'react';
import { Stack, TextField, Button, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from './loginConfig';
import { colorPallete } from '@/app/utils/colorspallete';
import { useRouter } from 'next/navigation';
import { InferType } from 'yup';

const FormLogin = () => {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<InferType<typeof loginSchema>>({
		resolver: yupResolver(loginSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const navigatiom = useRouter();

	const onSubmit = (data: InferType<typeof loginSchema>) => {
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
					xs: '100%',
					sm: 400,
				},
				minWidth: {
					xs: '90%',
					sm: 400,
				},
				margin: 'auto',
				gap: 2,
			}}>
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
