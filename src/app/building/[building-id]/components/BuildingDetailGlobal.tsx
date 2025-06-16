import { BuildingItemType } from '@/app/DTO/building';
import { colorPallete } from '@/app/utils/colorspallete';
import { formatRupiah } from '@/app/utils/formatCurency';
import { Stack, Typography } from '@mui/material';
import React from 'react';

interface Props {
	building?: BuildingItemType;
}

const BuildingDetailGlobal: React.FC<Props> = ({ building }) => {
	const address = building?.buildingAddress[0];
	const previewAddress = `${address?.jalan} RT ${address?.rt} RW ${address?.rw}, ${address?.kelurahan}, ${address?.kecamatan}, ${address?.kota}, ${address?.provinsi} ${address?.kodepos}`;
	return (
		<Stack
			sx={{
				padding: 2,
				bgcolor: colorPallete.white,
				boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.25)',
				height: '100%', // full height as well
				overflowY: 'auto',
				gap: 2,
			}}>
			<Typography variant='h4'>{building?.name}</Typography>
			<Typography>
				Harga : <strong>{formatRupiah(building?.price ?? 0)}</strong>
			</Typography>
			<Typography>{building?.description}</Typography>
			<hr />
			<Typography>{previewAddress}</Typography>
		</Stack>
	);
};

export default BuildingDetailGlobal;
