import Stack from '@mui/material/Stack';
import FormLogin from './components/FormLogin';

export default function Home() {
	return (
		<Stack
			justifyContent={'center'}
			alignItems={'center'}
			height={'100%'}>
			<FormLogin />
		</Stack>
	);
}
