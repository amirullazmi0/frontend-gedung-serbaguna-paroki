import Stack from '@mui/material/Stack';
import FormNewPassword from '../../components/FormNewPassword';

export default function Home() {
	return (
		<Stack
			justifyContent={'center'}
			alignItems={'center'}
			height={'100%'}
			py={4}>
			<FormNewPassword />
		</Stack>
	);
}
