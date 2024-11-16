import type { Employee } from '@prisma/client';
import { isHoliday } from 'calendar/holiday.js';

export const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function getTotalWorkshift(
  employee: Employee,
  year: number,
  month: number,
  worked_holidays: number[],
  unjustified_absences: number[],
  // unjustified_absences_previous_month: number[],
  worked_weekends: number[],
  vacation: number[],
  unpaid_leave: number[]
) {
  let total_worked_6h = 0;
  let total_worked_8h = 0;

  let worked_days_6h = [];
  let worked_days_8h = [];
  let worked_days = [];

  const lastDay = new Date(year, month, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const workShift = getWorkShiftByDay(
      employee,
      day,
      month,
      year,
      worked_holidays,
      unjustified_absences,
      // unjustified_absences_previous_month,
      worked_weekends,
      vacation,
      unpaid_leave
    );

    if (workShift === DayType.Day8h) {
      total_worked_8h++;
      worked_days_8h.push(day);
      worked_days.push(day);
    } else if (workShift === DayType.Day6h) {
      total_worked_6h++;
      worked_days_6h.push(day);
      worked_days.push(day);
    }
  }

  return {
    total_worked_6h,
    total_worked_8h,
    worked_days_6h,
    worked_days_8h,
    worked_days
  };
}

function getWorkShiftByDay(
  employee: Employee,
  day: number,
  month: number,
  year: number,
  worked_holidays: number[],
  unjustified_absences: number[],
  // unjustified_absences_previous_month: number[],
  worked_weekends: number[],
  vacation: number[],
  unpaid_leave: number[]
) {
  if (vacation.includes(day)) {
    return DayType.DayOff;
  }

  if (unpaid_leave.includes(day)) {
    return DayType.DayOff;
  }

  const dayOfWeek = getDayOfWeek(day, month, year);

  if (employee.work_shift == '8h') {
    if (unjustified_absences.includes(day)) {
      return DayType.DayOff;
    }

   // TODO REDUÇÃO DO DIA OLHANDO MÊS ANTERIOR
    // if (unjustified_absences_previous_month.includes(day)) {
    //   return DayType.DayOff;
    // }

    if (worked_holidays.includes(day) || isBusinessDay(dayOfWeek)) {
      return DayType.Day8h;
    }
    if (worked_weekends.includes(day)) {
      return DayType.Day6h;
    }

    return DayType.DayOff;
  }
  // TODO REDUÇÃO DO DIA OLHANDO MÊS ANTERIOR
  if (employee.work_shift == '6h') {
    if (unjustified_absences.includes(day) || isHoliday(day, month, year) || !isBusinessDay(dayOfWeek)) {
      return DayType.DayOff;
    }

    return DayType.Day6h;
  }

  throw 'Failed to get workshift for this day. Please check the employee/workdays informations';
}

export function isBusinessDay(day: string) {
  return day != 'Sunday' && day != 'Saturday';
}

export function getDayOfWeek(day: number, month: number, year: number) {
  const i = new Date(year, month - 1, day).getDay();
  return daysOfWeek[i];
}

enum DayType {
  DayOff,
  Day8h,
  Day6h,
}

export function parseCsvToList(list: string) {
  if (list == "") {
    return [];
  }
  
  return list.split(";").map((day: string) => Number(day));
}