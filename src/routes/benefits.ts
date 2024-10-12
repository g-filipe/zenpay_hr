import express, { Request, Response } from "express";
import { Employee } from "@models/employee.js";
import { calculateMealVoucher } from "benefits/meal-voucher/mealVoucher.js";

export const benefitRouter = express.Router();

benefitRouter.get("/meal-voucher", async (req: Request, res: Response) => {
  try {
    const employeeList = await Employee.find();
    const period = req.query.period as string;
    const [month, year] = period.split('/').map(n => Number(n));

    const mealVouchers = employeeList.map((employee) => {
      const { mealVoucher, voucher6h, voucher8h } = calculateMealVoucher(employee, month, year);
      
      return {
        name: employee.name,
        mealVoucher,  // valor total de meal voucher
        voucher6h,    // quantidade de vouchers 6h
        voucher8h,    // quantidade de vouchers 8h
        workedHoliday: employee.holidayWorkDays,
        workedWeekend: employee.weekendWorkDays
        
      }
    })

    res.status(200).json(mealVouchers);
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to retrieve employees meal vouchers from ${period}." });
  }

  
});