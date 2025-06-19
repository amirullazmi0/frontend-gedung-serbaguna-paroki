export interface UserAddressType {
  jalan: string | null;
  rt: string | null;
  rw: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kota: string | null;
  provinsi: string | null;
  kodepos: string | null;
}

export interface UserType {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  userPhoto: {
    url: string | null;
  };
  userAddress: UserAddressType;
}