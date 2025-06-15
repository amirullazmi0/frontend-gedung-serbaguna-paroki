'use client';
import React, { useContext, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { colorPallete } from '@/app/utils/colorspallete';
import { authContext } from '@/app/provider/auth-provider/authProvider';
import Image from 'next/image';
import logo from "@/assets/logo.jpg";

interface SidebarAdminProps {
  children: React.ReactNode;
}

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

export default function SidebarAdmin({ children }: SidebarAdminProps) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();
  const pathname = usePathname();
	const {user} = useContext(authContext)

  const DrawerList = (
    <Box sx={{ width: 350 }}>
			<Stack p={2} justifyContent={'center'} alignItems={'center'} gap={2}>
				<Image
					src={logo}
					alt="logo"
					width={100}
					height={100}
				/>
				<Typography variant="h5" sx={{ color: colorPallete['low-blue'] }}>
					Admin
				</Typography>
			</Stack>
      <List>
        {SidebarItem.map((item, index) => (
          <ListItem key={index}>
            <ListItemButton
              onClick={() => router.push(item.url)} sx={{
								borderRadius:2,
								backgroundColor: pathname === item.url ? colorPallete['low-blue'] : 'transparent',
								color: pathname === item.url ? colorPallete.white : 'inherit',
								':hover':{
									backgroundColor: pathname === item.url ? colorPallete['low-blue'] : 'inherit',
								color: pathname === item.url ? colorPallete.white : 'inherit',
								}
							}}>
              <ListItemIcon sx={{
								color: pathname === item.url ? colorPallete.white : 'inherit',
							}}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <PersonOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Profil" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <LogoutOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Stack direction="row">
      {/* Mobile menu button */}
      {!isDesktop && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1,
            bgcolor: 'white',
            boxShadow: 2,
            '&:hover': {
              bgcolor: '#f0f0f0',
            },
          }}>
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar */}
      {isDesktop ? (
        <Box sx={{ 
					width: 350, 
					flexShrink: 0 , 
					boxShadow: '0px 0px 20px -5px rgba(0, 0, 0, 0.25)',
				}}>{DrawerList}</Box>
      ) : (
        <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
          {DrawerList}
        </Drawer>
      )}

      {/* Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          // mt: 2,
        }}>
        {children}
      </Box>
    </Stack>
  );
}
