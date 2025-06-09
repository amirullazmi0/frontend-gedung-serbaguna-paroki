import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

interface PhoneInputProps {
	name: string;
	label: string;
	error?: string;
	field: any;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ name, label, error, field }) => {
	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(/[^0-9]/g, '');
		if (value.length === 1 && value[0] !== '8') {
			return;
		}
		field.onChange(value);
	};

	return (
		<TextField
			{...field}
			label={label}
			type='text'
			fullWidth
			error={!!error}
			helperText={error}
			onChange={handlePhoneChange}
			InputProps={{
				startAdornment: <InputAdornment position='start'>+62</InputAdornment>,
			}}
			inputProps={{
				inputMode: 'numeric',
				pattern: '[0-9]*',
			}}
		/>
	);
};

export default PhoneInput;
