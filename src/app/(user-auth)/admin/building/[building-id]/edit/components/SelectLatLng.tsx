'use client';
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LatLng, LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet.css'; // Assuming you have your custom CSS for the map

import leaficon from '@/assets/leaflet-icon.png';

const customIcon = new L.Icon({
	iconUrl: leaficon.src, // Use the imported image for the icon
	iconSize: [60, 60], // Adjust the size of the icon
	iconAnchor: [30, 52], // Anchor point of the icon
	popupAnchor: [0, -32], // Popup position relative to the marker
});

export interface latLngProps {
	lat: number;
	lng: number;
}

interface Props {
	lat?: number;
	lng?: number;
	onChange: (e: LatLng) => void; // Pass a LatLng object to the parent component
}

const SelectLatLng = ({ onChange, lat, lng }: Props) => {
	const mapRef: any = useRef(null);
	const [API_KEY] = useState('YGBPAuY7utv2Y7SgHp2N');
	const layer = [
		{ name: 'Standar', kode: 'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}@2x.png?key=' + API_KEY },
		{ name: 'osm', kode: 'https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=' + API_KEY },
		{ name: 'satelit', kode: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + API_KEY },
	];

	const [tile, setTile] = useState(layer[0].kode);
	const [markerPosition, setMarkerPosition] = useState<LatLngExpression>([1.331662502724799, 109.93096005307532]);
	useEffect(() => {
		if (lat && lng) {
			setMarkerPosition([lat, lng]);
			if (mapRef.current) {
				const map = mapRef.current;
				map.setView([lat, lng]); // Set the view to the provided lat/lng
			}
		}
	}, [lat, lng]);
	function OnCLickMap() {
		const map = useMapEvents({
			click: () => {
				// map.locate();
			},
			preclick: e => {
				console.log('location found:', e.latlng);
				setMarkerPosition([e.latlng.lat, e.latlng.lng]);
				// map.flyTo(e.latlng);

				onChange(e.latlng);
			},
		});
		return null;
	}

	return (
		<MapContainer
			className='map'
			ref={mapRef}
			center={markerPosition}
			// minZoom={6}
			zoom={13}
			zoomControl={false}
			style={{ height: '100vh' }}>
			<OnCLickMap />
			<TileLayer
				url={tile}
				attribution="&copy; <a href='https://www.maptiler.com/copyright/'>MapTiler</a> &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
			/>

			{/* Add Marker at the clicked position */}
			<Marker
				icon={customIcon}
				position={markerPosition}>
				{/* <Popup>Lokasi Kamu</Popup> */}
			</Marker>
		</MapContainer>
	);
};

export default SelectLatLng;
