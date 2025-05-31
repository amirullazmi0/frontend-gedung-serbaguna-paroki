import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().required('Nama wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  role: yup
    .string()
    .oneOf(['user', 'admin'], 'Role harus user atau admin')
    .default('user')
    .required('Role wajib diisi'),
  password: yup.string()
    .required('Password wajib diisi')
    .min(8, 'Password harus memiliki minimal 8 karakter')
    .matches(/[A-Z]/, 'Password harus mengandung huruf besar')
    .matches(/[a-z]/, 'Password harus mengandung huruf kecil')
    .matches(/\d/, 'Password harus mengandung angka')
    .matches(/[\W_]/, 'Password harus mengandung karakter khusus'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Konfirmasi Password harus sama dengan Password')
    .required('Konfirmasi Password wajib diisi'),
});
