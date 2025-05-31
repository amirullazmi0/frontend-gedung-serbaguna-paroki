import Stack from '@mui/material/Stack';
import FormRegister from './components/FormRegister';

export default function Home() {
	return (
		<Stack
			justifyContent={'center'}
			alignItems={'center'}
			height={'100%'}
			py={4}>
			<FormRegister />
		</Stack>
	);
}
