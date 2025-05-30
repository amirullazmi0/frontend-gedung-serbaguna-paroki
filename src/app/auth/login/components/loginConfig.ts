import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().required('Email wajib diisi'),
  password: yup.string().required('Password wajib diisi'),
});

