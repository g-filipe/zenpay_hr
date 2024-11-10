import express, { Request, Response } from "express";
import { getTotalWorkshift } from "workdaysControl.js";
import { findEmployeeById } from "./employees.js";
import { prisma } from "@db/prisma.js";

export const workdaysRouter = express.Router();

workdaysRouter.get(
  "/employee/workdays",
  async (req: Request, res: Response) => {
    try {
      const workdaysListByPeriod = await prisma.employee.findMany({
        where: {
          work_days: {
            some: {
              month: Number(req.query.month),
              year: Number(req.query.year),
            },
          },
        },
        include: {
          work_days: {
            omit: {
              employee_id: true,
            },
            where: {
              month: Number(req.query.month),
              year: Number(req.query.year),
            },
          },
        },
      });

      res.status(200).json(workdaysListByPeriod);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: `Failed to retrieve workdays by period ${req.query.month}/${req.query.year}`,
      });
    }
  }
);

workdaysRouter.get(
  "/employee/:id/workdays",
  async (req: Request, res: Response) => {
    try {
      const { month, year } = req.query;

      let workDaysFilter = {};

      if (month || year) {
        workDaysFilter = {
          work_days: {
            some: {
              month: month ? Number(month) : undefined,
              year: year ? Number(year) : undefined,
            },
          },
        };
      }

      const employee = await prisma.employee.findUnique({
        where: {
          ...workDaysFilter,
          id: Number(req.params.id),
        },
        include: {
          work_days: {
            omit: {
              employee_id: true,
            },
            where: {
              month: month ? Number(month) : undefined,
              year: year ? Number(year) : undefined,
            },
          },
        },
      });

      if (!employee) {
        res.status(404).json({ error: `Employee ${req.params.id} not found` });
        return;
      }

      res.status(200).json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: `Failed to retrieve workdays by period ${req.query.month}/${req.query.year}`,
      });
    }
  }
);

workdaysRouter.put(
  "/employee/:id/workdays",
  async (req: Request, res: Response) => {
    const employeeId = Number(req.params.id);
    try {
      const employee = await findEmployeeById(employeeId);

      if (!employee) {
        res.status(404).json({ error: `Employee ${employeeId} not found` });
        return;
      }

      const {
        worked_holidays,
        worked_weekends,
        vacation,
        unjustified_absences,
        month,
        year,
      } = req.body;

      const { total_worked_6h, total_worked_8h } = await getTotalWorkshift(
        employee,
        year,
        month,
        worked_holidays,
        unjustified_absences,
        worked_weekends
      );

      const data = {
        worked_holidays,
        worked_weekends,
        vacation,
        unjustified_absences,
        total_worked_days: total_worked_6h + total_worked_8h,
        worked_6h: total_worked_6h,
        worked_8h: total_worked_8h,
      };

      await prisma.workdays.upsert({
        where: {
          employee_id_month_year: {
            employee_id: employeeId,
            month,
            year,
          },
        },
        update: {
          ...data,
        },
        create: {
          employee_id: employeeId,
          ...data,
          month,
          year,
        },
      });

      res
        .status(200)
        .send(
          `${employee.name} - escala de fim de semanas e feriados atualizados`
        );
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to update employee" });
    }
  }
);

workdaysRouter.delete(
  "/employee/:id/workdays",
  async (req: Request, res: Response) => {
    const employeeId = Number(req.params.id);
    try {
      const { month, year } = req.query;
      const employee = findEmployeeById(employeeId);

      if (!employee) {
        res.status(404).json({ error: `Employee ${req.params.id} not found` });
        return;
      }

      const deletedAmount = await prisma.workdays.deleteMany({
        where: {
          employee_id: employeeId,
          month: month ? Number(month) : undefined,
          year: year ? Number(year) : undefined,
        },
      });

      res.status(200).json({
        message: `Deleted ${deletedAmount.count} workday(s) successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete workdays" });
    }
  }
);
