'use client';
import React, { useState, useEffect } from 'react';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './leaflet.css';
import 'leaflet/dist/leaflet.css';

import { Button, Stack } from '@mui/material';
import { LegendCard } from './map-component/LegendCard';
import RouteInfoCard from './map-component/RouteInfoCard';
import DetailModal from './map-component/DetailModal';
import { buildingItemType, buildingsDummy } from '../DTO/building';
import Image from 'next/image';

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

	useEffect(() => {
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
	const layer = [
		{ name: 'Standar', kode: 'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}@2x.png?key=' + API_KEY },
		{ name: 'osm', kode: 'https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=' + API_KEY },
		{ name: 'satelit', kode: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + API_KEY },
	];

	const [tile, setTile] = useState(layer[0].kode);
	const [userPosition, setUserPosition] = useState<LatLngExpression | null>(null);
	const [selectedMarker, setSelectedMarker] = useState<null | { position: LatLngExpression; name: string; description: string }>(null);
	const [destination, setDestination] = useState<LatLngExpression | null>(null);
	const [routeInfo, setRouteInfo] = useState<{ totalDistance: number; totalTime: number } | null>(null);
	const [transportMode, setTransportMode] = useState<'car' | 'foot' | 'bike'>('car');
	const [openDetailModal, setOpenDetailModal] = useState(false);

	const [detailMarker, setDetailMarker] = useState<buildingItemType>();

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

	return (
		<>
			<LegendCard
				layers={layer}
				selectedTile={tile}
				onChangeTile={setTile}
				onUpdateUserLocation={updateUserLocation}
				onClearRoute={() => {
					setDestination(null);
					setRouteInfo(null);
				}}
				hasRoute={Boolean(destination)}
			/>

			{routeInfo && destination && (
				<RouteInfoCard
					distance={routeInfo.totalDistance}
					time={routeInfo.totalTime}
					transportMode={transportMode}
					onChangeTransportMode={setTransportMode}
				/>
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

				{buildingsDummy.map(building => (
					<Marker
						key={building.id}
						position={[building.latitude, building.longitude]}
						eventHandlers={{
							click: () => {
								setSelectedMarker({
									position: [building.latitude, building.longitude],
									name: building.name,
									description: building.description,
								});
								// setDestination(null); // optional sesuai kebutuhan
							},
						}}>
						<Popup>
							<strong>{building.name}</strong>
							<br />
							{building.description}
							<br />
							{building.image && building.image.length > 0 && (
								<div style={{ marginTop: 8, width: '100%', height: 150, position: 'relative' }}>
									<Image
										src={building.image[0]}
										alt={`${building.name} image 1`}
										fill
										style={{ objectFit: 'cover', borderRadius: 8 }}
										sizes='(max-width: 600px) 100vw, 600px'
										priority
									/>
								</div>
							)}
							<Stack
								direction='row'
								gap={1}
								mt={1}>
								<Button
									variant='contained'
									size='small'
									onClick={() => setDestination([building.latitude, building.longitude])}>
									Tampilkan Rute
								</Button>
								<Button
									variant='contained'
									color='success'
									size='small'
									onClick={() => {
										setDetailMarker(building);
										setOpenDetailModal(true);
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
			</MapContainer>

			<DetailModal
				open={openDetailModal}
				data={detailMarker}
				onClose={() => setOpenDetailModal(false)}
			/>
		</>
	);
};

export default DashboardMap;
