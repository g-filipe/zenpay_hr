import express, { Request, Response } from "express";
import { prisma } from "@db/prisma.js";

export const employeeRouter = express.Router();

employeeRouter.get("/employee", async (_, res: Response) => {
  try {
    const employeeList = await prisma.employee.findMany({
      include: {
        departments: {
          select: {
            department: {
              select: {
                id: true,
                name: true,
                leader_id: true,
                leader: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          id: "asc",
        },
      ],
    });
    res.status(200).json(employeeList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve employee list" });
  }
});

employeeRouter.get("/employee/:id", async (req: Request, res: Response) => {
  const employeeId = Number(req.params.id);

  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
      include: {
        departments: {
          select: {
            department: {
              select: {
                id: true,
                name: true,
                leader_id: true,
                leader: true,
              },
            },
          },
        },
      },
    });

    if (!employee) {
      res.status(404).json({ error: `Employee ${employeeId} not found!` });
      return;
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve employee" });
  }
});

employeeRouter.post("/employee", async (req: Request, res: Response) => {
  try {
    const cpfExistence = await verifyCpfExistence(req.body.cpf);
    if (cpfExistence) {
      res.status(400).json({ error: "CPF already in use" });
      return;
    }

    const newEmployee = await prisma.employee.create({
      data: {
        name: req.body.name,
        cpf: req.body.cpf,
        work_shift: req.body.work_shift,
        work_schedule: req.body.work_schedule,
        departments: {
          create: req.body.department_id.map((id: number) => ({
            department: { connect: { id } },
          })),
        },
      },
    });

    res.status(200).json({
      message: `Register ID: ${newEmployee.id} Employee: ${newEmployee.name} Status: Saved Successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register employee" });
  }
});

employeeRouter.put("/employee/:id", async (req: Request, res: Response) => {
  const employeeId = Number(req.params.id);
  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
    });
    if (!employee) {
      res.status(404).json({ error: `Employee ${employeeId} not found` });
      return;
    }

    const updatedEmployee = await prisma.$transaction(async (prisma) => {
      await prisma.employeeDepartments.deleteMany({
        where: {
          employee_id: employeeId,
        },
      });

      await prisma.employeeDepartments.createMany({
        data: req.body.department_id.map((departmentId: number) => ({
          employee_id: employeeId,
          department_id: departmentId,
        })),
      });

      return prisma.employee.update({
        where: {
          id: employeeId,
        },
        data: {
          name: req.body.name,
          cpf: req.body.cpf,
          work_shift: req.body.work_shift,
          work_schedule: req.body.work_schedule,
        },
      });
    });

    res.status(200).json({
      message: `Register ID: ${updatedEmployee.id} Employee: ${updatedEmployee.name} Status: Updated Successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

employeeRouter.delete("/employee/:id", async (req: Request, res: Response) => {
  const employeeId = Number(req.params.id);
  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee) {
      res.status(404).json({ error: `Employee ${employeeId} not found!` });
      return;
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.employeeDepartments.deleteMany({
        where: {
          employee_id: employeeId,
        },
      });

      return prisma.employee.delete({
        where: {
          id: employeeId,
        },
      });
    });

    res.status(200).json({
      message: `Employee ${employeeId} - ${employee.name} has been deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

// employeeRouter.put(
//   "/employee/:id/workdays",
//   async (req: Request, res: Response) => {
//     const employeeId = req.params.id;
//     try {
//       const employee = await searchEmployeeById(employeeId);
//       if (!employee) {
//         res.status(404).json({ error: `Employee ${employeeId} not found` });
//         return;
//       }

//       const period = req.body.period;

//       await Employee.findByIdAndUpdate(employeeId, {
//         [`holidayWorkDays.${period}`]: req.body.holidayWorkDays,
//         [`weekendWorkDays.${period}`]: req.body.weekendWorkDays,
//         [`unjustifiedAbsences.${period}`]: req.body.unjustifiedAbsences,
//         [`unjustifiedAbsencesPreviousMonth.${period}`]:
//           req.body.unjustifiedAbsencesPreviousMonth,
//       });

//       res
//         .status(200)
//         .send(
//           `${employee.name} - escala de fim de semanas e feriados atualizados`
//         );
//     } catch (error) {
//       res.status(500).json({ error: "Failed to update employee" });
//     }
//   }
// );

async function verifyCpfExistence(cpf: string) {
  return await prisma.employee.findUnique({
    where: {
      cpf,
    },
  });
}
