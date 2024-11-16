import express, { Request, Response } from 'express';
import { prisma } from '@db/prisma.js';
import { calculateMealVoucher } from 'benefits/meal-voucher/mealVoucherService.js';

export const mealVoucherRouter = express.Router();

mealVoucherRouter.get('/employee/benefits/meal-voucher', async (req: Request, res: Response) => {
  try {
    const workdaysListByPeriod = await prisma.employee.findMany({
      where: {
        work_days: {
          some: {
            month: Number(req.query.month),
            year: Number(req.query.year),
          },
        },
        contract_type: 'efetivo',
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
        meal_vouchers: {
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
});

mealVoucherRouter.get('/employee/:id/benefits/meal-voucher', async (req: Request, res: Response) => {
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
        meal_vouchers: {
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
});

mealVoucherRouter.post('/employee/:id/benefits/meal-voucher', async (req: Request, res: Response) => {
  const employeeId = Number(req.params.id);
  const month = Number(req.body.month);
  const year = Number(req.body.year);

  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
      include: {
        work_days: {
          where: {
            month,
            year,
          },
        },
        meal_vouchers: {
          where: {
            month,
            year,
          },
        },
      },
    });

    if (!employee) {
      res.status(404).json({ error: `Employee ${employeeId} not found` });
      return;
    }

    if (employee.work_days.length == 0) {
      res.status(400).json({ error: `No workdays registered for this Employee ${employeeId} - ${employee.name}.` });
      return;
    }
    const mealVoucher = await prisma.$transaction(async (prisma) => {
      if (employee.meal_vouchers.length != 0) {
        await prisma.mealVoucher.delete({
          where: {
            employee_id_month_year: {
              employee_id: employeeId,
              month,
              year,
            },
          },
        });
      }

      const data = await calculateMealVoucher(employee, employee.work_days[0]);

      return await prisma.mealVoucher.create({
        data: {
          employee_id: employeeId,
          month,
          year,
          ...data,
        },
      });
    });
    res.status(201).json({
      message: `Employee ${employeeId} - ${employee.name} has a new meal voucher benefit registered successfully for the period ${month}/${year}.`,
      mealVoucher,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Failed to register a meal voucher benefit for the period ${month}/${year} ` });
  }
});
