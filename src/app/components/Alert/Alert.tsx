'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Box, Stack, Typography, LinearProgress } from '@mui/material';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export type AlertType = 'success' | 'error';

export interface AlertProps {
	type: AlertType;
	title?: string;
	message?: string;
	open: boolean;
	onClose: () => void;
	timeout?: number;
	timerShow?: boolean; // 👈 toggles timer visibility
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, open, onClose, timeout, timerShow = false }) => {
	const [escHoldTime, setEscHoldTime] = useState(0);
	const holdRef = useRef<NodeJS.Timeout | null>(null);

	const [elapsedTime, setElapsedTime] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// ESC hold-to-close logic
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				if (!holdRef.current) {
					holdRef.current = setInterval(() => {
						setEscHoldTime(prev => {
							const newTime = prev + 100;
							if (newTime >= 1000) {
								onClose();
								clearInterval(holdRef.current!);
								holdRef.current = null;
								return 0;
							}
							return newTime;
						});
					}, 100);
				}
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && holdRef.current) {
				clearInterval(holdRef.current);
				holdRef.current = null;
				setEscHoldTime(0);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			if (holdRef.current) clearInterval(holdRef.current);
		};
	}, [onClose]);

	// Timer for open duration (for progress bar)
	useEffect(() => {
		if (open) {
			setElapsedTime(0);
			intervalRef.current = setInterval(() => {
				setElapsedTime(prev => prev + 100);
			}, 100);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [open]);

	// Timeout auto-close
	useEffect(() => {
		if (open && timeout) {
			const timer = setTimeout(() => {
				onClose();
			}, timeout);
			return () => clearTimeout(timer);
		}
	}, [open, timeout, onClose]);

	if (!open) return null;

	const Icon = type === 'success' ? DoneOutlineIcon : ErrorOutlineIcon;
	const color = type === 'success' ? 'green' : 'red';
	const progress = timeout ? Math.min((elapsedTime / timeout) * 100, 100) : 0;

	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				bgcolor: 'rgba(0, 0, 0, 0.5)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 9999,
			}}>
			<Box
				sx={{
					bgcolor: 'white',
					borderRadius: 2,
					p: 3,
					minWidth: {
						xs: '90%',
						md: '25%',
					},
					maxWidth: {
						xs: '95%',
						md: '33%',
					},
					boxShadow: 4,
				}}>
				<Stack
					// direction='row'
					alignItems='center'
					gap={1}>
					<Icon sx={{ color, fontSize: 100 }} />
					<Typography
						variant='h5'
						fontWeight='bold'
						color={color}>
						{title || (type === 'success' ? 'Success' : 'Error')}
					</Typography>
				</Stack>

				{message && (
					<Typography
						variant='body2'
						textAlign={'center'}
						mt={1}
						color='text.secondary'>
						{message}
					</Typography>
				)}

				{timerShow && timeout && (
					<Box mt={2}>
						<LinearProgress
							variant='determinate'
							value={progress}
							color='primary'
							sx={{ borderRadius: 1 }}
						/>
						<Typography
							variant='caption'
							color='text.secondary'
							display='block'
							mt={0.5}>
							Auto-close in {Math.max((timeout - elapsedTime) / 1000, 0).toFixed(1)}s
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
};
