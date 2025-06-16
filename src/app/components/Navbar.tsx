'use client';
import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, CssBaseline, useScrollTrigger, Box, IconButton, Avatar, Menu, MenuItem, Tooltip, Button, Stack, Paper, ClickAwayListener } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { authContext } from '../provider/auth-provider/authProvider';
import { colorPallete } from '../utils/colorspallete';
import Image from 'next/image';
import logo from '@/assets/logo.jpg';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';

interface Props {
	window?: () => Window;
}

function ElevationScroll(props: { children: React.ReactElement<any>; window?: () => Window }) {
	const { children, window } = props;
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
		target: window ? window() : undefined,
	});

	return React.cloneElement(children, {
		elevation: trigger ? 4 : 0,
	});
}

// 🔸 User menu or Login button
function AuthActions({ authenticated, user, handleOpenUserMenu }: { authenticated: boolean; user: any; handleOpenUserMenu: (e: React.MouseEvent<HTMLElement>) => void }) {
	const router = useRouter();

	if (authenticated) {
		return (
			<IconButton
				onClick={handleOpenUserMenu}
				sx={{ p: 0 }}>
				<Avatar alt={user?.email ?? 'account'} />
			</IconButton>
		);
	}

	return (
		<Button
			variant='contained'
			onClick={() => router.push('/auth/login')}>
			Login
		</Button>
	);
}

// 🔸 Main Component
export default function Navbar(props: Props) {
	const { authenticated, user } = useContext(authContext);
	const pathName = usePathname();
	const router = useRouter();

	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const RenderUserMenu = ({ anchorEl, onClose, user, router }: { anchorEl: HTMLElement | null; onClose: () => void; user: any; router: any }) => {
		if (!anchorEl) return null;

		const rect = anchorEl.getBoundingClientRect();

		return (
			<ClickAwayListener onClickAway={onClose}>
				<Box
					component={Paper}
					elevation={4}
					sx={{
						position: 'absolute',
						top: rect.bottom + window.scrollY,
						right: 10,
						zIndex: 1300,
						minWidth: 160,
						p: 1,
					}}>
					{user && (
						<MenuItem
							onClick={() => {
								onClose();
								router.push(`/${user.role.toLowerCase()}`);
							}}>
							<Typography sx={{ textAlign: 'center' }}>Dashboard</Typography>
						</MenuItem>
					)}
					{user && (
						<MenuItem onClick={onClose}>
							<Typography sx={{ textAlign: 'center' }}>Logout</Typography>
						</MenuItem>
					)}
				</Box>
			</ClickAwayListener>
		);
	};

	// 🔹 Homepage Navbar
	if (pathName === '/') {
		return (
			<Stack
				position='fixed'
				top={0}
				left='50%'
				flexDirection='row'
				justifyContent='space-between'
				alignItems='center'
				sx={{
					transform: 'translateX(-50%)',
					zIndex: 100,
					bgcolor: colorPallete.white,
					px: 2,
					py: 1.5,
					width: {
						xs: '100vw',
						md: '40%',
					},
					borderBottomRightRadius: 10,
					borderBottomLeftRadius: 10,
				}}>
				<Stack
					direction='row'
					alignItems='center'
					gap={1}>
					<Typography
						fontWeight={600}
						color={colorPallete.primary}>
						Sewa Gedung
					</Typography>
				</Stack>

				<Stack
					direction='row'
					alignItems='center'
					gap={1}>
					<Button
						variant='contained'
						onClick={() => router.push('/building')}>
						List Gedung
					</Button>
					<AuthActions
						authenticated={authenticated}
						user={user}
						handleOpenUserMenu={handleOpenUserMenu}
					/>
					<RenderUserMenu
						anchorEl={anchorElUser}
						onClose={handleCloseUserMenu}
						user={user}
						router={router}
					/>
				</Stack>
			</Stack>
		);
	}

	// 🔹 AppBar-style Navbar (for /building, etc.)

	if (pathName.startsWith('/building')) {
		return (
			<React.Fragment>
				<CssBaseline />
				<ElevationScroll {...props}>
					<AppBar
						sx={{
							bgcolor: 'white',
							boxShadow: '0px 5px 10px 0px rgb(0, 0, 0, 0.1)',
							color: colorPallete.black,
						}}>
						<Toolbar sx={{ justifyContent: 'space-between' }}>
							<Typography variant='h6'>Sewa Gedung</Typography>
							<Stack
								direction='row'
								gap={1}>
								<Button
									variant='contained'
									onClick={() => router.push('/	')}
									sx={{ gap: 1 }}>
									<FmdGoodOutlinedIcon />
									Maps
								</Button>
								<AuthActions
									authenticated={authenticated}
									user={user}
									handleOpenUserMenu={handleOpenUserMenu}
								/>
								<RenderUserMenu
									anchorEl={anchorElUser}
									onClose={handleCloseUserMenu}
									user={user}
									router={router}
								/>
							</Stack>
						</Toolbar>
					</AppBar>
				</ElevationScroll>
				<Toolbar />
			</React.Fragment>
		);
	}
}
