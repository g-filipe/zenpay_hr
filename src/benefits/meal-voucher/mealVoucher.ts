import { IEmployee } from "@models/employee.js";
import { isHoliday } from "calendar/holiday.js";
import { getPeriod } from "utils.js";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const diaryMealVoucher6h = 22;
const diaryMealVoucher8h = 36.6;

export function calculateMealVoucher(employee: IEmployee, month: number, year: number) {
  let totalMealVoucher = 0;
  let mealVoucher6h = 0;
  let mealVoucher8h = 0;

  const period = `${month}/${year}`;
  const unjustifiedAbsencesPreviousMonth = employee.unjustifiedAbsencesPreviousMonth?.get(period) ?? [];
  const lastDay = new Date(year, month, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const voucher = calculateMealVoucherByDay(employee, day, month, year);

    if (voucher === diaryMealVoucher8h) {
      mealVoucher8h++;
    } else if (voucher === diaryMealVoucher6h) {
      mealVoucher6h++;
    }

    totalMealVoucher += voucher;
  }

  unjustifiedAbsencesPreviousMonth.forEach((day) => {
    totalMealVoucher -= calculateMealVoucherDiscountByDayOfPreviousMonth(day, month, year);
  });

  return {
    mealVoucher: totalMealVoucher.toFixed(2),
    voucher6h: mealVoucher6h,
    voucher8h: mealVoucher8h
  };
}

function calculateMealVoucherByDay(employee: IEmployee, day: number, month: number, year: number) {

  const dayOfWeek = getDayOfWeek(day, month, year);
  const period = getPeriod(month, year);
  const holidayWorkDays = employee.holidayWorkDays?.get(period) ?? [];
  const weekendWorkDays = employee.weekendWorkDays?.get(period) ?? [];
  const unjustifiedAbsences = employee.unjustifiedAbsences?.get(period) ?? [];

  if (employee.workShift == "8h") {
    if (unjustifiedAbsences.includes(day)) {
      return 0;
    }
    if (holidayWorkDays.includes(day) || isBusinessDay(dayOfWeek)) {
      return diaryMealVoucher8h;
    }
    if (weekendWorkDays.includes(day)) { 
      return diaryMealVoucher6h;
    }

    return 0
  }

  if (employee.workShift == "6h") {
    if (unjustifiedAbsences.includes(day) || isHoliday(day,month, year) ||!isBusinessDay(dayOfWeek)) {
      return 0;
    }
 
    return diaryMealVoucher6h;
  }
  
  throw 'Failed to calculate the current meal voucher. Please check the employee informations';
}

function calculateMealVoucherDiscountByDayOfPreviousMonth(day: number, month: number, year: number) {

  let previousMonth = month - 1
  
  if (previousMonth == 0) {
    previousMonth = 12;
    year--
  }

  if (isHoliday(day, month, year) || isBusinessDay(getDayOfWeek(day, month, year))) {
    return diaryMealVoucher8h;
  }

  return diaryMealVoucher6h;

}

function isBusinessDay(day: string) {
  return day != "Sunday" && day != "Saturday";
}

function getDayOfWeek(day: number, month: number, year: number) {
  const i = new Date(year, month - 1, day).getDay();
  return daysOfWeek[i];
}
