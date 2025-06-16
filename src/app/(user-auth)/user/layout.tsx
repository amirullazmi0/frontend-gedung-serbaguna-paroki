import { colorPallete } from '@/app/utils/colorspallete';
import { Box, Stack } from '@mui/material';
import SidebarUser from './components/SidebarUser';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Stack
			minHeight={'100vh'}
			width={'100vw'}
			overflow={'hidden'}
			bgcolor={colorPallete.white}>
			<SidebarUser>{children}</SidebarUser>
		</Stack>
	);
}
