import Stack from '@mui/material/Stack';
import FormForgetPassword from './components/FormForgetPassword';

export default function Home() {
	return (
		<Stack
			justifyContent={'center'}
			alignItems={'center'}
			height={'100%'}
			py={4}>
			<FormForgetPassword />
		</Stack>
	);
}
