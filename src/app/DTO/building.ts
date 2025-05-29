export interface buildingItemType {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  image: string[];
}

export const buildingsDummy: buildingItemType[] = [
  {
    id: 1,
    name: 'Gedung Sudirman',
    latitude: -6.2248,
    longitude: 106.8102,
    description: 'Gedung perkantoran di kawasan Sudirman Jakarta.',
    image: [],
  },
  {
    id: 2,
    name: 'Gedung Thamrin',
    latitude: -6.1935,
    longitude: 106.8234,
    description: 'Gedung perkantoran di kawasan Thamrin Jakarta.',
    image: [],
  },
  {
    id: 3,
    name: 'Gedung Kuningan',
    latitude: -6.2254,
    longitude: 106.8290,
    description: 'Gedung perkantoran di kawasan Kuningan Jakarta Selatan.',
    image: [],
  },
  {
    id: 4,
    name: 'Gedung Rasuna Said',
    latitude: -6.2171,
    longitude: 106.8316,
    description: 'Gedung perkantoran dan komersial di Jalan Rasuna Said.',
    image: [],
  },
  {
    id: 5,
    name: 'Gedung Balai Sudirman',
    latitude: -6.2245,
    longitude: 106.8057,
    description: 'Gedung pertemuan dan kantor di Jalan Sudirman.',
    image: [],
  },
  {
    id: 6,
    name: 'Gedung Wisma 46',
    latitude: -6.2243,
    longitude: 106.8097,
    description: 'Gedung pencakar langit ikonik di pusat bisnis Jakarta.',
    image: [],
  },
  {
    id: 7,
    name: 'Gedung Bank Indonesia',
    latitude: -6.1751,
    longitude: 106.8272,
    description: 'Gedung pusat Bank Indonesia di Jakarta Pusat.',
    image: [],
  },
  {
    id: 8,
    name: 'Gedung Plaza Indonesia',
    latitude: -6.1931,
    longitude: 106.8217,
    description: 'Pusat perbelanjaan dan kantor di kawasan Thamrin.',
    image: [],
  },
  {
    id: 9,
    name: 'Gedung Kota Kasablanka',
    latitude: -6.2241,
    longitude: 106.8361,
    description: 'Gedung multifungsi di kawasan Casablanca Jakarta Selatan.',
    image: [],
  },
  {
    id: 10,
    name: 'Gedung Pacific Place',
    latitude: -6.2196,
    longitude: 106.8232,
    description: 'Gedung perkantoran dan pusat perbelanjaan di SCBD.',
    image: [],
  },
];
