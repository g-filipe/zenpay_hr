export function paddingZero(date: number) {
  return String(date).padStart(2, '0')
}

export function getPeriod (month: number, year: number) {
 return `${paddingZero(month)}/${paddingZero(year)}`
}