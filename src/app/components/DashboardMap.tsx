'use client';
import { Button, Checkbox, FormControlLabel, Stack, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { LatLngExpression } from 'leaflet';
import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './leaflet.css';
import 'leaflet/dist/leaflet.css';
import { colorPallete } from '../utils/colorspallete';

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const RecenterMap = ({ latlng }: { latlng: LatLngExpression }) => {
	const map = useMap();
	React.useEffect(() => {
		if (latlng) {
			map.setView(latlng, 15, { animate: true });
		}
	}, [latlng, map]);
	return null;
};

const RoutingMachine = ({
	from,
	to,
	profile,
	onRouteFound,
}: {
	from: L.LatLngExpression | null;
	to: L.LatLngExpression | null;
	profile: 'car' | 'foot' | 'bike';
	onRouteFound?: (summary: { totalDistance: number; totalTime: number }) => void;
}) => {
	const map = useMap();
	const routingControlRef = React.useRef<any>(null);

	React.useEffect(() => {
		if (!from || !to) {
			if (routingControlRef.current) {
				routingControlRef.current.remove();
				routingControlRef.current = null;
			}
			if (onRouteFound) onRouteFound({ totalDistance: 0, totalTime: 0 });
			return;
		}

		if (routingControlRef.current) {
			routingControlRef.current.setWaypoints([L.latLng(from), L.latLng(to)]);
			routingControlRef.current.getRouter().options.profile = profile;
		} else {
			routingControlRef.current = L.Routing.control({
				waypoints: [L.latLng(from), L.latLng(to)],
				routeWhileDragging: false,
				showAlternatives: false,
				addWaypoints: false,
				fitSelectedRoutes: true,
				router: L.Routing.osrmv1({
					serviceUrl: 'https://router.project-osrm.org/route/v1',
					profile: profile,
				}),
			})
				.on('routesfound', (e: any) => {
					if (onRouteFound) {
						const route = e.routes[0];
						const summary = route.summary;
						onRouteFound({
							totalDistance: summary.totalDistance,
							totalTime: summary.totalTime,
						});
					}
				})
				.addTo(map);
		}

		return () => {
			if (routingControlRef.current) {
				routingControlRef.current.remove();
				routingControlRef.current = null;
				if (onRouteFound) onRouteFound({ totalDistance: 0, totalTime: 0 });
			}
		};
	}, [from, to, profile, map, onRouteFound]);

	return null;
};

const DashboardMap = () => {
	const [API_KEY] = useState('YGBPAuY7utv2Y7SgHp2N');
	const defaultPosition: LatLngExpression = [-0.021549253076259666, 109.3358068951819];
	const layer: { name: 'Standar' | 'satelit' | 'osm'; kode: string }[] = [
		{
			name: 'Standar',
			kode: 'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}@2x.png?key=' + API_KEY,
		},
		{
			name: 'osm',
			kode: 'https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=' + API_KEY,
		},
		{
			name: 'satelit',
			kode: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + API_KEY,
		},
	];

	const [tile, setTile] = useState(layer[0].kode);
	const [userPosition, setUserPosition] = useState<LatLngExpression | null>(null);

	const [selectedMarker, setSelectedMarker] = useState<null | { position: LatLngExpression; name: string; description: string }>(null);
	const [destination, setDestination] = useState<LatLngExpression | null>(null);
	const [routeInfo, setRouteInfo] = useState<{ totalDistance: number; totalTime: number } | null>(null);

	// Mode transportasi state
	const [transportMode, setTransportMode] = useState<'car' | 'foot' | 'bike'>('car');

	// Modal state
	const [openDetailModal, setOpenDetailModal] = useState(false);
	const [detailMarker, setDetailMarker] = useState<null | { name: string; description: string }>(null);

	const updateUserLocation = () => {
		if (!navigator.geolocation) {
			alert('Geolocation tidak didukung oleh browser ini.');
			return;
		}
		navigator.geolocation.getCurrentPosition(
			pos => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
			err => alert(`Gagal mendapatkan lokasi: ${err.message}`),
			{ enableHighAccuracy: true }
		);
	};

	React.useEffect(() => {
		updateUserLocation();
	}, []);

	const markers: { position: LatLngExpression; name: string; description: string }[] = [
		{
			position: [-6.2088, 106.8456],
			name: 'Monumen Nasional (Monas)',
			description: 'Ikon bersejarah dan simbol Jakarta',
		},
		{
			position: [-6.1745, 106.8227],
			name: 'Kota Tua Jakarta',
			description: 'Area bersejarah dengan bangunan kolonial Belanda',
		},
		{
			position: [-6.1214, 106.7741],
			name: 'Ancol Dreamland',
			description: 'Taman hiburan dan pantai di Jakarta Utara',
		},
		{
			position: [-6.2243, 106.8383],
			name: 'Stasiun Gambir',
			description: 'Stasiun kereta utama di Jakarta Pusat',
		},
		{
			position: [-6.3023, 106.8959],
			name: 'Taman Mini Indonesia Indah',
			description: 'Taman budaya yang menampilkan keanekaragaman Indonesia',
		},
	];

	// Format helpers
	const formatDistance = (meters: number) => (meters / 1000).toFixed(2) + ' km';
	const formatTime = (seconds: number) => Math.ceil(seconds / 60) + ' menit';

	const TransportModeCard = () => (
		<Stack>
			<Typography
				variant='subtitle1'
				fontWeight='bold'
				gutterBottom>
				Pilih Mode Transportasi
			</Typography>
			<Stack spacing={1}>
				<Button
					variant={transportMode === 'car' ? 'contained' : 'outlined'}
					onClick={() => setTransportMode('car')}
					fullWidth>
					Mobil
				</Button>
				<Button
					variant={transportMode === 'foot' ? 'contained' : 'outlined'}
					onClick={() => setTransportMode('foot')}
					fullWidth>
					Jalan Kaki
				</Button>
				<Button
					variant={transportMode === 'bike' ? 'contained' : 'outlined'}
					onClick={() => setTransportMode('bike')}
					fullWidth>
					Sepeda / Motor
				</Button>
			</Stack>
		</Stack>
	);

	const LegendCard = () => (
		<Stack
			position='absolute'
			bottom={0}
			right={0}
			zIndex={10}
			sx={{ padding: 2, bgcolor: colorPallete.white, borderRadius: 2, m: 4, width: 240 }}>
			{layer.map(item => {
				const isSelected = tile === item.kode;
				return (
					<FormControlLabel
						key={item.name}
						control={
							<Checkbox
								checked={isSelected}
								onChange={() => setTile(item.kode)}
							/>
						}
						label={item.name}
					/>
				);
			})}

			<Button
				variant='contained'
				onClick={updateUserLocation}
				sx={{ mt: 2 }}>
				Lokasi Saya Sekarang
			</Button>

			{destination && (
				<Button
					variant='outlined'
					color='error'
					sx={{ mt: 1 }}
					onClick={() => {
						setDestination(null);
						setRouteInfo(null);
					}}>
					Hapus Rute
				</Button>
			)}
		</Stack>
	);

	return (
		<>
			<LegendCard />

			{routeInfo && destination && (
				<Paper
					sx={{
						position: 'absolute',
						bottom: 16,
						left: 16,
						zIndex: 1000,
						bgcolor: colorPallete.white,
						p: 2,
						borderRadius: 2,
						width: 240,
					}}>
					<Stack gap={2}>
						<Typography
							variant='subtitle1'
							fontWeight='bold'
							gutterBottom>
							Info Rute
						</Typography>
						<TransportModeCard />
						<Stack>
							<Typography>Jarak: {formatDistance(routeInfo.totalDistance)}</Typography>
							<Typography>Perkiraan Waktu: {formatTime(routeInfo.totalTime)}</Typography>
						</Stack>
					</Stack>
				</Paper>
			)}

			<MapContainer
				className='map'
				center={selectedMarker ? selectedMarker.position : userPosition || defaultPosition}
				minZoom={6}
				zoom={13}
				style={{ height: '100vh' }}>
				<TileLayer
					url={tile}
					attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
				/>

				{userPosition && <RecenterMap latlng={userPosition} />}

				{userPosition && (
					<Marker position={userPosition}>
						<Popup>
							<strong>Lokasi Saya</strong>
						</Popup>
					</Marker>
				)}

				{markers.map(marker => (
					<Marker
						key={marker.name}
						position={marker.position}
						eventHandlers={{
							click: () => {
								setSelectedMarker(marker);
								// setDestination(null);
							},
						}}>
						<Popup>
							<strong>{marker.name}</strong>
							<br />
							{marker.description}
							<br />
							<Stack
								direction='row'
								gap={1}
								mt={1}>
								<Button
									variant='contained'
									size='small'
									onClick={() => setDestination(marker.position)}>
									Tampilkan Rute
								</Button>
								<Button
									variant='contained'
									color='success'
									size='small'
									onClick={() => {
										setDetailMarker(marker);
									}}>
									Detail
								</Button>
							</Stack>
						</Popup>
					</Marker>
				))}

				<RoutingMachine
					from={userPosition}
					to={destination}
					profile={transportMode}
					onRouteFound={setRouteInfo}
				/>

				{/* Detail modal */}
				<Dialog
					open={Boolean(detailMarker)}
					onClose={() => setDetailMarker(null)}
					maxWidth={false} // supaya bisa custom width
					PaperProps={{
						sx: {
							width: {
								xs: '90vw', // mobile
								sm: '80vw', // tablet
								md: '50vw', // desktop
							},
							maxWidth: 'none',
						},
					}}>
					<DialogTitle>{detailMarker?.name}</DialogTitle>
					<DialogContent>
						<DialogContentText>{detailMarker?.description}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setDetailMarker(null)}>Tutup</Button>
					</DialogActions>
				</Dialog>
			</MapContainer>
		</>
	);
};

export default DashboardMap;
