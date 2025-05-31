'use client';

import React, { useEffect, useState } from 'react';
import { Stack, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { colorPallete } from '@/app/utils/colorspallete';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerSchema } from './registerConfig';
import { InferType } from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PasswordChecklist from '@/app/components/PasswordCheckList';
import { generatePassword } from '@/app/utils/generatePassword';

const FormRegister = () => {
	const {
		control,
		handleSubmit,
		setValue,
		reset,
		trigger,
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

	// 👇 Real-time effect for role change
	useEffect(() => {
		console.log('role changed to:', role);
	}, [role]);

	// 👇 State for show/hide password
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const toggleShowPassword = () => setShowPassword(prev => !prev);
	const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

	const onSubmit = (data: InferType<typeof registerSchema>) => {
		console.log('Form Data:', data);
		// Handle register logic here
	};

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
					onClick={() => navigation.push('/auth/register?role=user')}>
					Penyewa
				</Button>
				<Button
					sx={{ textTransform: 'none' }}
					variant='contained'
					size='small'
					onClick={() => navigation.push('/auth/register?role=admin')}>
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
			{!role || (role !== 'user' && role !== 'admin') ? (
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
						<span style={{ color: colorPallete.black }}>{role === 'user' ? 'Penyewa' : 'Penyedia Gedung'}</span>
					</Typography>

					<Controller
						name='name'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label='Nama'
								error={!!errors.name}
								helperText={errors.name?.message}
								fullWidth
							/>
						)}
					/>

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

					{/* Password with show/hide toggle */}
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

					{/* Confirm Password with show/hide toggle */}
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
						variant='contained'
						disabled={!isValid}
						sx={{ gridColumn: { xs: 'span 1', md: 'span 2' }, mt: 5 }}>
						Register
					</Button>
				</>
			)}

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
