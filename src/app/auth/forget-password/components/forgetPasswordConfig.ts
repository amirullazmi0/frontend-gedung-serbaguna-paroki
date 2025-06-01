import * as yup from "yup";

export const forgetPasswordSchema = yup.object({
  email: yup.string().required('Email wajib diisi'),
});

export const newPasswordSchema = yup.object({
  password: yup.string()
    .required('Password wajib diisi')
    .min(8, 'Password harus memiliki minimal 8 karakter')
    .matches(/[A-Z]/, 'Password harus mengandung huruf besar')
    .matches(/[a-z]/, 'Password harus mengandung huruf kecil')
    .matches(/\d/, 'Password harus mengandung angka'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Konfirmasi Password harus sama dengan Password')
    .required('Konfirmasi Password wajib diisi'),
});

