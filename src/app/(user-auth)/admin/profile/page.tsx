'use client';
import { UserType } from '@/app/DTO/user';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import { colorPallete } from '@/app/utils/colorspallete';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';
import ChangePhotoProfile from './components/ChangePhotoProfile';
import ChangeAddress from './components/ChangeAddress';
import ChangeProfile from './components/ChangeProfile';
import ChangeNewPassword from './components/ChangeNewPassword';

export default function Home() {
	const {
		data: userData,
		isLoading,
		error,
	} = useQueryApiRequest<GlobalApiResponse<UserType>>({
		key: 'get-user-auth',
		withAuth: true,
	});

	return (
		<Stack
			// justifyContent='center'
			alignItems='center'
			sx={{
				minHeight: '100svh',
				width: '100%',
				bgcolor: colorPallete.white,
				padding: 2,
			}}>
			<Stack
				sx={{
					width: {
						xs: '100%',
						md: '80%',
						lg: '60%',
					},
					height: '100%',
					gap: 3,
				}}>
				<ChangePhotoProfile user={userData?.data} />
				<ChangeProfile user={userData?.data} />
				<ChangeAddress user={userData?.data} />
				<ChangeNewPassword user={userData?.data} />
			</Stack>
		</Stack>
	);
}
