'use client';
import { useActivation, useRegister } from '@/app/hook/auth/useAuthMutation';
import { colorPallete } from '@/app/utils/colorspallete';
import { ErrorData } from '@/app/utils/globalsApiResponse';
import { Box, Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
	const { mutateAsync: activation, isPending, data, isSuccess, isError, error } = useActivation();
	const [dataUser, setDataUser] = useState<{
		name: string;
		email: string;
	}>();

	const token = useParams()['activation-token'] as string;
	const navigation = useRouter();
	console.log('token', token);

	useEffect(() => {
		if (token) {
			const activate = async () => {
				await activation({
					token: token,
				});
			};

			activate();
		}
	}, [token]);

	useEffect(() => {
		if (isSuccess) {
			setMessage('Aktivasi akun berhasil');
			setCardType('Success');
			if (data) {
				setDataUser(data.data);
			}
		}

		if (isError) {
			const err: AxiosError = error as AxiosError;
			const errorData: ErrorData = err.response?.data as ErrorData;
			setMessage(errorData.message ?? 'Aktivasi akun gagal');
			setCardType('Error');
		}
	}, [isSuccess, isError, error, data]);

	const [message, setMessage] = useState('');
	type type = 'Success' | 'Error';
	const [cardType, setCardType] = useState<type>('Success');
	const Card = ({ message, cardType }: { message: string; cardType: type }) => {
		return (
			<Stack
				justifyContent={'center'}
				alignItems={'center'}
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
					textAlign={'center'}>
					{cardType === 'Success' ? 'Welcome' : 'Aktivasi Gagal'}
				</Typography>
				<Typography textAlign={'center'}>{dataUser?.name}</Typography>
				<Box
					sx={{
						bgcolor: cardType === 'Success' ? colorPallete.success : colorPallete.error,
						color: colorPallete.white,
						padding: 1,
						borderRadius: 2,
					}}>
					<Typography textAlign={'center'}>{message}</Typography>
				</Box>

				<Typography textAlign={'center'}>{cardType == 'Error' && 'Silahkan aktivasi kembali, atau hubungi admin'}</Typography>
				<Button
					size='small'
					variant='contained'
					onClick={() => navigation.push('/auth/login')}
					sx={{
						textTransform: 'none',
						width: 'fit-content',
					}}>
					Kembali ke halaman login
				</Button>
			</Stack>
		);
	};

	return (
		<Stack
			justifyContent={'center'}
			alignItems={'center'}
			height={'100%'}
			py={4}>
			{/* {isPending} */}
			<Card
				message={message}
				cardType={cardType}
			/>
		</Stack>
	);
}
