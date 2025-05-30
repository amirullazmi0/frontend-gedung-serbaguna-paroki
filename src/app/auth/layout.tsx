import { Box, Stack } from '@mui/material';
import { colorPallete } from '../utils/colorspallete';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Stack
			minHeight={'100vh'}
			width={'100vw'}
			overflow={'hidden'}
			bgcolor={colorPallete.white}>
			<Stack
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: 'repeat(1, 1fr)',
						md: 'repeat(2, 1fr)',
					},
				}}>
				<Stack
					zIndex={10}
					minHeight={'100vh'}
					p={2}>
					{children}
				</Stack>
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						background: 'linear-gradient(90deg,rgb(47, 89, 255) 0%,rgb(26, 59, 138) 100%)',
						padding: 20,
						m: 2,
						borderTopLeftRadius: 100,
						borderBottomLeftRadius: 50,
						borderBottomRightRadius: 250,
						borderTopRightRadius: 30,
					}}
				/>

				<Box
					sx={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						background: 'linear-gradient(90deg,rgb(34, 35, 36) 0%,rgb(40, 83, 224) 100%)',
						padding: 10,
						m: 2,
						borderTopLeftRadius: 100,
						borderBottomLeftRadius: 10,
						borderTopRightRadius: 700,
						borderBottomRightRadius: 400,
					}}
				/>
				<Stack
					p={{
						xs: 0,
						md: 5,
					}}>
					<Stack
						sx={{
							background: 'linear-gradient(90deg, #4a90e2 0%,rgb(40, 37, 42) 100%)',
							width: '100%',
							height: '100%',
							borderTopLeftRadius: '100%',
							borderBottomLeftRadius: '50%',
							borderBottomRightRadius: '50%',
							borderTopRightRadius: '30%',
						}}
					/>
				</Stack>
			</Stack>
		</Stack>
	);
}
