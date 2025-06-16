'use client';
import React, { useRef, useState } from 'react';
import L from 'leaflet';
import { LatLng, LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet.css'; // Assuming you have your custom CSS for the map
import { BuildingItemType } from '@/app/DTO/building';
import Image from 'next/image';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import SourceIcon from '@mui/icons-material/Source';

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Props {
	building?: BuildingItemType[];
}

const MapBuilding: React.FC<Props> = ({ building }) => {
	const mapRef = useRef(null);
	const [API_KEY] = useState('YGBPAuY7utv2Y7SgHp2N');
	const layer = [
		{ name: 'Standar', kode: 'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}@2x.png?key=' + API_KEY },
		{ name: 'osm', kode: 'https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=' + API_KEY },
		{ name: 'satelit', kode: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + API_KEY },
	];

	const centerPosition: LatLngExpression = [-0.021549253076259666, 109.3358068951819];
	const router = useRouter();
	return (
		<MapContainer
			className='map'
			ref={mapRef}
			center={centerPosition}
			minZoom={6}
			zoomControl={false}
			zoom={13}>
			<TileLayer
				url={layer[0].kode}
				attribution="&copy; <a href='https://www.maptiler.com/copyright/'>MapTiler</a> &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
			/>

			{/* Add Marker at the clicked position */}
			{building &&
				building.map((item, index) => (
					<Marker
						key={index}
						position={[Number(item.buildingAddress[0].lat), Number(item.buildingAddress[0].lng)]}>
						<Popup>
							<Stack
								sx={{
									width: 180,
									// gap: 1,
								}}>
								<Stack
									sx={{
										position: 'relative',
										width: '100%',
										height: 100,
										overflow: 'hidden',
										borderRadius: 2,
									}}>
									<Image
										src={item.buildingPhoto[0].url}
										alt={item.name}
										fill
										sizes='180px'
										style={{
											objectFit: 'cover',
											// borderRadius: 8,
										}}
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
