'use client';
import React, { useRef, useState } from 'react';
import L from 'leaflet';
import { LatLng, LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet.css'; // Assuming you have your custom CSS for the map

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Props {
	lat: number;
	lng: number;
}

const MapBuildingDetail = ({ lat, lng }: Props) => {
	const mapRef = useRef(null);
	const [API_KEY] = useState('YGBPAuY7utv2Y7SgHp2N');
	const layer = [
		{ name: 'Standar', kode: 'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}@2x.png?key=' + API_KEY },
		{ name: 'osm', kode: 'https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=' + API_KEY },
		{ name: 'satelit', kode: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + API_KEY },
	];

	const markerPosition: LatLngExpression = [Number(lat), Number(lng)];

	return (
		<MapContainer
			className='map'
			ref={mapRef}
			center={markerPosition}
			minZoom={6}
			zoomControl={false}
			zoom={13}>
			<TileLayer
				url={layer[0].kode}
				attribution="&copy; <a href='https://www.maptiler.com/copyright/'>MapTiler</a> &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
			/>

			{/* Add Marker at the clicked position */}
			<Marker position={markerPosition}>
				<Popup>Lokasi Gedung</Popup>
			</Marker>
		</MapContainer>
	);
};

export default MapBuildingDetail;
