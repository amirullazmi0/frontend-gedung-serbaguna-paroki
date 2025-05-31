'use client';

import React from 'react';
import { Stack, Typography } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { colorPallete } from '../utils/colorspallete';

type PasswordChecklistProps = {
	password: string;
};

const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password }) => {
	const checklist = {
		minLength: password.length >= 8,
		hasUpper: /[A-Z]/.test(password),
		hasLower: /[a-z]/.test(password),
		hasNumber: /\d/.test(password),
	};

	const getColor = (condition: boolean) => (condition ? colorPallete.success : colorPallete['grey']);

	return (
		<Stack
			direction='row'
			flexWrap='wrap'
			gap={2}
			mt={1}>
			<Stack
				direction='row'
				alignItems='center'
				gap={0.5}>
				<CheckCircleOutline
					fontSize='small'
					sx={{
						color: getColor(checklist.minLength),
					}}
				/>
				<Typography
					variant='body2'
					sx={{
						color: getColor(checklist.minLength),
					}}>
					Min. 8 karakter
				</Typography>
			</Stack>
			<Stack
				direction='row'
				alignItems='center'
				gap={0.5}>
				<CheckCircleOutline
					fontSize='small'
					sx={{
						color: getColor(checklist.hasUpper),
					}}
				/>
				<Typography
					variant='body2'
					sx={{
						color: getColor(checklist.hasUpper),
					}}>
					Huruf Kapital
				</Typography>
			</Stack>
			<Stack
				direction='row'
				alignItems='center'
				gap={0.5}>
				<CheckCircleOutline
					fontSize='small'
					sx={{
						color: getColor(checklist.hasLower),
					}}
				/>
				<Typography
					variant='body2'
					sx={{
						color: getColor(checklist.hasLower),
					}}>
					Huruf kecil
				</Typography>
			</Stack>
			<Stack
				direction='row'
				alignItems='center'
				gap={0.5}>
				<CheckCircleOutline
					fontSize='small'
					sx={{
						color: getColor(checklist.hasNumber),
					}}
				/>
				<Typography
					variant='body2'
					sx={{
						color: getColor(checklist.hasNumber),
					}}>
					Angka
				</Typography>
			</Stack>
		</Stack>
	);
};

export default PasswordChecklist;
