import { prisma } from '@db/prisma.js';
import { Employee, Workdays } from '@prisma/client';
import { isHoliday } from 'calendar/holiday.js';
import { getConfig, meal_voucher_6h_value, meal_voucher_8h_value } from 'config.js';
import { getDayOfWeek, isBusinessDay } from 'workdaysService.js';

export async function calculateMealVoucher(employee: Employee, workdays: Workdays) {
  const diaryMealVoucher6h = (await getConfig(meal_voucher_6h_value)) as number;
  const diaryMealVoucher8h = (await getConfig(meal_voucher_8h_value)) as number;

  let total_discount_6h = 0;
  let total_discount_8h = 0;
  let total_days_6h_discounted = 0;
  let total_days_8h_discounted = 0;

  let { year, month } = workdays;

  let previousMonth = month - 1;

  let yearOfPreviousMonth = year;

  if (previousMonth == 0) {
    previousMonth = 12;
    yearOfPreviousMonth--;
  }

  const previousWorkDays = await prisma.workdays.findUnique({
    select: {
      created_at: true,
      unjustified_absences: true,
      MealVoucher: true,
    },
    where: {
      employee_id_month_year: {
        employee_id: employee.id,
        month: previousMonth,
        year: yearOfPreviousMonth,
      },
    },
  });

  let unjustified_absences_previous_month: number[] = [];

  if (previousWorkDays?.MealVoucher) {
    unjustified_absences_previous_month = previousWorkDays.unjustified_absences;
  }

  unjustified_absences_previous_month
    .filter((day) => day >= workdays.created_at.getDate())
    .forEach((day) => {
      const discount = calculateMealVoucherDiscountByDayOfPreviousMonth(
        day,
        month,
        year,
        diaryMealVoucher6h,
        diaryMealVoucher8h
      );
      if (discount == diaryMealVoucher6h) {
        total_discount_6h += discount;
        total_days_6h_discounted++;
      } else {
        total_discount_8h += discount;
        total_days_8h_discounted++;
      }
    });

  const total_discount = total_discount_6h + total_discount_8h;
  const total_value_6h = workdays.worked_6h * diaryMealVoucher6h;
  const total_value_8h = workdays.worked_8h * diaryMealVoucher8h;

  return {
    amount: total_value_6h + total_value_8h - total_discount,
    total_value_6h,
    total_value_8h,
    total_discount_6h,
    total_discount_8h,
    total_discount,
    total_days_6h_discounted,
    total_days_8h_discounted,
    total_days_discounted: total_days_6h_discounted + total_days_8h_discounted,
  };
}

function calculateMealVoucherDiscountByDayOfPreviousMonth(
  day: number,
  month: number,
  year: number,
  diaryMealVoucher6h: number,
  diaryMealVoucher8h: number
) {
  let previousMonth = month - 1;

  if (previousMonth == 0) {
    previousMonth = 12;
    year--;
  }

  if (isHoliday(day, month, year) || isBusinessDay(getDayOfWeek(day, month, year))) {
    return diaryMealVoucher8h;
  }

  return diaryMealVoucher6h;
}

export async function generateMealVoucher(employee: Employee, workdays: Workdays) {
  return await prisma.$transaction(async (prisma) => {
    await prisma.mealVoucher.deleteMany({
      where: {
        employee_id: employee.id,
        month: workdays.month,
        year: workdays.year,
      },
    });

    const data = await calculateMealVoucher(employee, workdays);

    return await prisma.mealVoucher.create({
      data: {
        employee_id: employee.id,
        month: workdays.month,
        year: workdays.year,
        ...data,
      },
    });
  });
}
