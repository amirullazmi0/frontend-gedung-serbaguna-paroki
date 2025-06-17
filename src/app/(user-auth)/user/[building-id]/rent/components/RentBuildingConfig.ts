import * as yup from "yup";
import dayjs, { Dayjs } from 'dayjs';

export const supportDocumentRequirementSchema = yup.object({
  supportDocumentId: yup.string().required('ID wajib diisi'),
  documentUrl: yup.string().url('Format URL tidak valid').required('File wajib diupload'),
})

export const rentBuildingConfigSchema = yup.object({
  buildingId: yup.string().required('ID wajib diisi'),
  startDate: yup
    .mixed<Dayjs>()
    .required('Tanggal mulai wajib diisi')
    .test('is-dayjs', 'Format tanggal tidak valid', value => dayjs.isDayjs(value)),
  endDate: yup
    .mixed<Dayjs>()
    .required('Tanggal selesai wajib diisi')
    .test('is-dayjs', 'Format tanggal tidak valid', value => dayjs.isDayjs(value)),
  supportDocumentRequirements: yup
    .array()
    .of(supportDocumentRequirementSchema)
    .default([]),
});