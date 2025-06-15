'use client';
import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { colorPallete } from '../utils/colorspallete';
import { Button, Stack } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { authContext } from '../provider/auth-provider/authProvider';

import logo from '@/assets/logo.jpg';
import Image from 'next/image';

function Navbar() {
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const route = useRouter();
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const { authenticated, user } = useContext(authContext);

	const pathName = usePathname();

	if (pathName == '/') {
		return (
			<Stack
				position='fixed'
				top={0}
				left='50%'
				flexDirection={'row'}
				justifyContent={'space-between'}
				sx={{
					transform: 'translateX(-50%)',
					zIndex: 100,
					bgcolor: colorPallete.white,
					padding: 2,
					width: {
						xs: '100vw',
						md: '40%',
					},
					borderBottomRightRadius: 10,
					borderBottomLeftRadius: 10,
				}}>
				<Stack
					direction={'row'}
					gap={1}>
					<Image
						alt='logo'
						src={logo}
						width={50}
						height={50}
					/>
					<Typography
						fontWeight={'600'}
						sx={{
							color: colorPallete['primary'],
						}}>
						Sewa Gedung <br />
						Sekarang
					</Typography>
				</Stack>
				<Stack>
					{authenticated ? (
						<>
							<Box sx={{ flexGrow: 0 }}>
								<Tooltip title='Open settings'>
									<IconButton
										onClick={handleOpenUserMenu}
										sx={{ p: 0 }}>
										<Avatar alt={user?.email ?? 'account'} />
									</IconButton>
								</Tooltip>
								<Menu
									sx={{ mt: '45px' }}
									// id='menu-appbar'
									anchorEl={anchorElUser}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}>
									{user && (
										<MenuItem onClick={handleCloseUserMenu}>
											<Typography sx={{ textAlign: 'center' }}>Dashboard</Typography>
										</MenuItem>
									)}

									{user && (
										<MenuItem onClick={handleCloseUserMenu}>
											<Typography sx={{ textAlign: 'center' }}>Logout</Typography>
										</MenuItem>
									)}
								</Menu>
							</Box>
						</>
					) : (
						<>
							<Button
								variant='contained'
								onClick={() => route.push('/auth/login')}>
								Login
							</Button>
						</>
					)}
				</Stack>
			</Stack>
		);
	}
}
export default Navbar;
