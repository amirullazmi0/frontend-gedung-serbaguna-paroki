import * as yup from 'yup';

export const AddressSchema = yup.object({
  jalan: yup.string().required('Jalan is required'),
  rt: yup.string().required('RT is required'),
  rw: yup.string().required('RW is required'),
  kelurahan: yup.string().required('Kelurahan is required'),
  kecamatan: yup.string().required('Kecamatan is required'),
  kota: yup.string().required('Kota is required'),
  provinsi: yup.string().required('Provinsi is required'),
  kodepos: yup.string().required('Kodepos is required'),
  lat: yup.string()
    .required('Latitude is required')
    .matches(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)/, 'Invalid latitude format'),
  lng: yup.string()
    .required('Longitude is required')
    .matches(/^[-+]?((1[0-7]\d(\.\d+)?)|([1-9]?\d(\.\d+)?))$/, 'Invalid longitude format'),
});

export const PhotoSchema = yup.object({
  url: yup.string().required('URL is required'),
});

export const SupportDocumentRequirementSchema = yup.object({
  name: yup.string().required('Name is required'),
  templateDocumentUrl: yup.string().url('Invalid URL format').notRequired(),
});

export const AddItemBuildingRequestSchema = yup.object({
  name: yup.string().required('Name is required'),
  price: yup.number().required('Price is required'),
  description: yup.string().required('Description is required'),
  address: AddressSchema,
  photo: yup.array().of(PhotoSchema).required('Photo is required'),
  supportDocumentRequirement: yup.array()
    .of(SupportDocumentRequirementSchema)
    .required('Support document requirements are required'),
});


