import { RentStatus } from '../(user-auth)/user/components/rentBuilding';

export const rentStatusColor = (status: RentStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
	switch (status) {
		case RentStatus.PENDING:
			return 'warning';
		case RentStatus.ONPROSES:
			return 'info';
		case RentStatus.SUCCESS:
			return 'success';
		case RentStatus.CANCELLED:
			return 'error';
		default:
			return 'default';
	}
};

export const rentStatusLabelChip = (status: RentStatus) => {
	switch (status) {
		case RentStatus.PENDING:
			return 'Menunggu';
		case RentStatus.ONPROSES:
			return 'Diproses';
		case RentStatus.SUCCESS:
			return 'Selesai';
		case RentStatus.CANCELLED:
			return 'Dibatalkan';
		default:
			return status;
	}
};
