'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { IconButton } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { colorPallete } from '@/app/utils/colorspallete';

export default function SidebarAdmin() {
	const [open, setOpen] = React.useState(false);
	const navigation = useRouter();
	const pathname = usePathname();
	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen);
	};

	const DrawerList = (
		<Box
			sx={{ width: 250 }}
			role='presentation'
			onClick={toggleDrawer(false)}>
			<List>
				{SidebarItem.map((item, index) => {
					return (
						<ListItem key={index}>
							<ListItemButton
								onClick={() => navigation.push(item.url)}
								sx={{
									bgcolor: pathname == item.url ? colorPallete.primary : 'inherit',
									color: pathname == item.url ? colorPallete.white : 'inherit',
									':hover': {
										bgcolor: pathname == item.url ? colorPallete.primary : 'inherit',
										color: pathname == item.url ? colorPallete.white : 'inherit',
									},
									borderRadius: 2,
								}}>
								<ListItemIcon
									sx={{
										color: pathname == item.url ? colorPallete.white : 'inherit',
									}}>
									{item.icon}
								</ListItemIcon>
								<ListItemText primary={item.text} />
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
			<Divider />
			<List>
				<ListItem>
					<ListItemButton>
						<ListItemIcon>
							<PersonOutlineOutlinedIcon />
						</ListItemIcon>
						<ListItemText primary={'Profil'} />
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton>
						<ListItemIcon>
							<LogoutOutlinedIcon />
						</ListItemIcon>
						<ListItemText primary={'Logout'} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);

	return (
		<div>
			<IconButton
				onClick={toggleDrawer(true)}
				sx={{
					position: 'fixed',
					left: 0,
					top: 0,
					bgcolor: 'white',
					zIndex: 10,
					boxShadow: '0px 0px 15px -7px rgba(0, 0, 0, 0.36)',
					margin: 1,
				}}>
				<MenuIcon />
			</IconButton>
			<Drawer
				open={open}
				onClose={toggleDrawer(false)}>
				{DrawerList}
			</Drawer>
		</div>
	);
}

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

export const SidebarItem: {
	icon: React.ReactNode;
	text: string;
	url: string;
}[] = [
	{
		icon: <DashboardOutlinedIcon />,
		text: 'Dashboard',
		url: '/admin',
	},
	{
		icon: <MapOutlinedIcon />,
		text: 'Map',
		url: '/admin/map',
	},
	{
		icon: <ArticleOutlinedIcon />,
		text: 'Report',
		url: '/admin/report',
	},
];
