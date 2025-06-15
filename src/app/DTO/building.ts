export interface addressType {
  jalan: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  lat: string;
  lng: string;
  kota: number;
  provinsi: string;
  kodepos: string;
}

export interface supportDocumentType {
  id: string;
  name: string;
  templateDocumentUrl: string;
}
export interface BuildingPhotoType {
  id: string;
  url: string;
}

export interface BuildingItemType {
  id: string;
  name: string;
  price: number;
  description: string;
  buildingPhoto: BuildingPhotoType[];
  buildingAddress: addressType[];
  supportDocumentRequirement: supportDocumentType[];
}

