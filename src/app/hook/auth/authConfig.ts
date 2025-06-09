import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  password: yup.string().required('Password wajib diisi'),
});

export const registerSchema = yup.object({
  name: yup.string().required('Nama wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  role: yup
    .string()
    .oneOf(['USER', 'ADMIN'], 'Role harus user atau admin')
    .default('USER')
    .required('Role wajib diisi'),
  phone: yup.string().required('Nomor whatsapp wajib diisi'),
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

export const activationSchema = yup.object({
  token: yup.string().required('Token wajib diisi'),
});

export const activationRequestSchema = yup.object({
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
})
