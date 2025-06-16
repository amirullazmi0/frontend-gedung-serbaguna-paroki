import { colorPallete } from '@/app/utils/colorspallete';
import { Box, Stack } from '@mui/material';
import SidebarAdmin from './components/SidebarAdmin';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Stack
			minHeight={'100vh'}
			width={'100vw'}
			overflow={'hidden'}
			bgcolor={colorPallete['low-grey']}>
			<SidebarAdmin>{children}</SidebarAdmin>
		</Stack>
	);
}
