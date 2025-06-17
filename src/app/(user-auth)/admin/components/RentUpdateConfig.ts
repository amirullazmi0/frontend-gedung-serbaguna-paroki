import * as yup from 'yup';
import { RentStatus } from '../../user/components/rentBuilding';
; // sesuaikan path-nya

export const updateRentBuildingSchema = yup.object({
  id: yup.string().required('ID wajib diisi'),
  status: yup
    .mixed<RentStatus>()
    .oneOf(Object.values(RentStatus), 'Status tidak valid')
    .required('Status wajib diisi'),
});
