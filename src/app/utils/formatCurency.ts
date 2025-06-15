export const formatRupiah = (value: number | string): string => {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(number)) return 'Rp 0,00';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};
