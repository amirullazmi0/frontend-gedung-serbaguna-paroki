import { Box, Stack } from '@mui/material';
import { colorPallete } from '../utils/colorspallete';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Stack
			minHeight={'100vh'}
			width={'100vw'}
			overflow={'hidden'}
			bgcolor={colorPallete.white}>
			{children}
		</Stack>
	);
}
