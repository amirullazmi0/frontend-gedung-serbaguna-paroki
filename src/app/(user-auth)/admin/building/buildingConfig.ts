import * as yup from 'yup';

export const AddressSchema = yup.object({
  jalan: yup.string().required('Jalan wajib diisi'),
  rt: yup.string().required('RT wajib diisi'),
  rw: yup.string().required('RW wajib diisi'),
  kelurahan: yup.string().required('Kelurahan wajib diisi'),
  kecamatan: yup.string().required('Kecamatan wajib diisi'),
  kota: yup.string().required('Kota wajib diisi'),
  provinsi: yup.string().required('Provinsi wajib diisi'),
  kodepos: yup.string().required('Kodepos wajib diisi'),
  lat: yup.string()
    .required('Latitude wajib diisi, pilih di peta')
    .matches(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)/, 'Format latitude tidak valid'),
  lng: yup.string()
    .required('Longitude wajib diisi, pilih di peta')
    .matches(/^[-+]?((1[0-7]\d(\.\d+)?)|([1-9]?\d(\.\d+)?))$/, 'Format longitude tidak valid'),
});

export const PhotoSchema = yup.object({
  url: yup.string().required('URL wajib diisi'),
});

export const SupportDocumentRequirementSchema = yup.object({
  name: yup.string().required('Nama wajib diisi'),
  templateDocumentUrl: yup.string().url('Format URL tidak valid').notRequired(), // Optional, no change needed
});

export const AddItemBuildingRequestSchema = yup.object({
  name: yup.string().required('Nama wajib diisi'),
  price: yup.number().required('Harga wajib diisi'),
  description: yup.string().default(''), // Make description nullable
  address: AddressSchema,
  photo: yup.array().of(PhotoSchema).required('Foto wajib diisi'),
  supportDocumentRequirement: yup.array()
    .of(SupportDocumentRequirementSchema)
    .default([]),
});
