import Stack from '@mui/material/Stack';
import { colorPallete } from '../utils/colorspallete';

export default function Home() {
	return (
		<Stack
			sx={{
				display: 'grid',
				gridTemplateColumns: {
					xs: 'repeat(1, 1fr)',
					md: 'repeat(3, 1fr)',
				},
				minHeight: '100svh',
			}}>
			<Stack sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}></Stack>
			<Stack
				sx={{
					bgcolor: colorPallete['low-blue'],
				}}></Stack>
		</Stack>
	);
}
