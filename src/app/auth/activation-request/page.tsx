import Stack from '@mui/material/Stack';
import FormActivationRequest from './components/FormActivationRequest';

export default function Home() {
	return (
		<Stack
			justifyContent={'center'}
			alignItems={'center'}
			height={'100%'}
			py={4}>
			<FormActivationRequest />
		</Stack>
	);
}
