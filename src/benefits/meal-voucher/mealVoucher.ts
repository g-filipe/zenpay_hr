import { Employee, IEmployee } from "@models/employee.js";

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function calculateMealVoucher(employee : IEmployee, month: number, year: number) {
  
  let totalMealVoucher = 0;
  const lastDay = new Date(year, month, 0).getDate() 

  for (let day = 1; day <= lastDay; day++) {
    totalMealVoucher += calculateMealVoucherByDay(employee, day, month, year)
  }
  
  return totalMealVoucher
}

function calculateMealVoucherByDay(employee : IEmployee, day: number, month: number, year: number) {
  let mealVoucher = 0
  const dayOfWeek = getDayOfWeek(day, month, year)
  const diaryMealVoucher6h = 22;
  const diaryMealVoucher8h = 36.60;
  const period = `${month}/${year}`
  const holidayWorkDays = employee.holidayWorkDays[period]
  const weekendWorkDays = employee.weekendWorkDays[period]
  const unjustifiedAbsences = employee.unjustifiedAbsences[period]

  if (employee.workShift == '8h') {

    holidayWorkDays.includes(day)


  }


  // console.log({day, dayOfWeek, month, year})
  return mealVoucher
}

function isBusinessDay(day : string) {
  return day != 'Sunday' && day != 'Saturday'
}

function getDayOfWeek(day: number, month: number, year: number) {
  const i = new Date(year, month - 1, day).getDay()
  return daysOfWeek[i]
}

// test
// calculateMealVoucher('8h', 2, 2024)