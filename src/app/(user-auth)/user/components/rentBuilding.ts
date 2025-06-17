export enum RentStatus {
  PENDING = 'PENDING',
  ONPROSES = 'ONPROSES',
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED',
}

export interface RentBuildingItemType {
  id: string;
  buildingId: string;
  userId: string;
  status: RentStatus;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;

  building: {
    name: string;
    buildingPhoto: {
      id: string;
      buildingId: string;
      url: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };

  supportDocumentRentBuilding: {
    id: string;
    documentUrl: string;
    createdAt: string;
    updatedAt: string;
    supportDocumentRequirement: {
      name: string;
    };
  }[];

  invoice: {
    url: string
  }[]; // bisa diganti kalau ada detail
  _count: {
    invoice: number;
    supportDocumentRentBuilding: number;
  };
}
