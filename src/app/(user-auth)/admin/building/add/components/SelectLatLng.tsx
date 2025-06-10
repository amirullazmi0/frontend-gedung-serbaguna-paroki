'use client';
import React, { useState, useEffect } from 'react';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './leaflet.css';
import 'leaflet/dist/leaflet.css';

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const SelectLatLng = () => {
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
			</MapContainer>
		</>
	);
};

export default SelectLatLng;
