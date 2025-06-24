'use client';

import React, { useRef, useState, useEffect } from 'react';
import L, { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet.css';
import { BuildingItemType } from '@/app/DTO/building';
import Image from 'next/image';
import { Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import SourceIcon from '@mui/icons-material/Source';
import useQueryApiRequest from '@/app/hook/useQueryApiRequest';
import { GlobalApiResponse } from '@/app/utils/globalsApiResponse';

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapBuilding = () => {
	const { data: buildingResponse } = useQueryApiRequest<GlobalApiResponse<BuildingItemType[]>>({
		key: 'get-admin-building',
		withAuth: true,
	});

	const building = buildingResponse?.data;
	const mapRef: any = useRef(null);
	const [API_KEY] = useState('YGBPAuY7utv2Y7SgHp2N');
	const layer = [
		{ name: 'Standar', kode: 'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}@2x.png?key=' + API_KEY },
		{ name: 'osm', kode: 'https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=' + API_KEY },
		{ name: 'satelit', kode: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + API_KEY },
	];

	const [centerPosition, setCenterPosition] = useState([1.331662502724799, 109.93096005307532]);
	const router = useRouter();

	// Pastikan kode yang menggunakan `window` hanya dijalankan di sisi klien
	useEffect(() => {
		if (building && building[0]?.buildingAddress[0]) {
			const address = building[0].buildingAddress[0];
			const newLatLng = [Number(address?.lat), Number(address?.lng)];

			// Perbarui peta menggunakan useRef tanpa merender ulang state
			if (mapRef.current) {
				mapRef.current.setView(newLatLng, 17); // Set new center without re-render
			}
			setCenterPosition(newLatLng); // Update centerPosition state untuk kebutuhan lain
		}
	}, [building]);

	return (
		<MapContainer
			className='map'
			ref={mapRef}
			center={centerPosition as LatLngExpression}
			minZoom={6}
			zoomControl={false}
			zoom={13}>
			<TileLayer
				url={layer[0].kode}
				attribution="&copy; <a href='https://www.maptiler.com/copyright/'>MapTiler</a> &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
			/>

			{building &&
				building.map((item, index) => (
					<Marker
						key={index}
						position={[Number(item.buildingAddress[0].lat), Number(item.buildingAddress[0].lng)]}>
						<Popup>
							<Stack sx={{ width: 180 }}>
								<Stack sx={{ position: 'relative', width: '100%', height: 100, overflow: 'hidden', borderRadius: 2 }}>
									<Image
										src={item.buildingPhoto[0].url}
										alt={item.name}
										fill
										sizes='180px'
										style={{ objectFit: 'cover' }}
									/>
								</Stack>
								<Typography textAlign={'center'}>
									<strong>{item.name}</strong>
								</Typography>
								<Stack
									justifyContent={'center'}
									alignItems={'center'}>
									<Button
										color='success'
										sx={{ gap: 1 }}
										onClick={() => router.push(`/admin/building/${item.id}`)}>
										<SourceIcon />
										Detail
									</Button>
								</Stack>
							</Stack>
						</Popup>
					</Marker>
				))}
		</MapContainer>
	);
};

export default MapBuilding;
