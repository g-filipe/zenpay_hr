export function paddingZero(date: number) {
  return String(date).padStart(2, '0')
}

export function getPeriod (month: number, year: number) {
 return `${paddingZero(month)}/${paddingZero(year)}`
}

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatForBrazilianReal = (value: number) => {
  return formatter.format(value);
};
