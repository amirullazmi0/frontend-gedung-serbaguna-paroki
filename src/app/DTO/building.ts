export interface addressType {
  jalan: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  lat: string;
  lng: string;
  kota: string;
  provinsi: string;
  kodepos: string;
  createdAt: string;
  updatedAt: string;
}

export interface supportDocumentType {
  id: string;
  name: string;
  templateDocumentUrl: string;
  createdAt: string;
  updatedAt: string;
}
export interface BuildingPhotoType {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserBuildingType {
  id: string;
  email: string;
  phone: string;
  name: string
}

export interface BuildingItemType {
  id: string;
  name: string;
  price: number;
  description: string;
  buildingPhoto: BuildingPhotoType[];
  buildingAddress: addressType[];
  supportDocumentRequirement: supportDocumentType[];
  user: UserBuildingType;
  createdAt: string;
  updatedAt: string;
}

