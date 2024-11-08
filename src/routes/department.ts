import express, { Request, Response } from "express";
// import { Employee } from "@models/department.js";
// import mongoose from "mongoose";
import { prisma } from "@db/prisma.js";

export const departmentRouter = express.Router();

departmentRouter.get("/department", async (_, res: Response) => {
  try {
    const departmentList = await prisma.department.findMany({
      include: {
        employees:true
      }
    });
    res.status(200).json(departmentList);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve department list" });
  }
});

// departmentRouter.get("/department/:id", async (req: Request, res: Response) => {
//   const departmentId = req.params.id;
//   try {
//     const department = await searchEmployeeById(departmentId);
//     if (!department) {
//       res.status(404).json({ error: `Employee ${departmentId} not found!` });
//       return;
//     }
//     res.status(200).json(department);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve department" });
//   }
// });

departmentRouter.post("/department", async (req: Request, res: Response) => {
  try {
    const departmentExistence = await verifyDepartmentExistence(req.body.name);
    if (departmentExistence) {
      res.status(400).json({ error: "Department already registered" });
      return;
    }

    const newDepartment = await prisma.department.create({
      data: {
        name: req.body.name,
        leader_id: req.body.leader_id
      },
    });

    res.status(200).json({
      message: `Register ID: ${newDepartment.id} - Department: ${newDepartment.id} Status: Saved Successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register department" });
  }
});

// departmentRouter.put("/department/:id", async (req: Request, res: Response) => {
//   const departmentId = req.params.id;
//   try {
//     const department = await searchEmployeeById(departmentId);
//     if (!department) {
//       res.status(404).json({ error: `Employee ${departmentId} not found` });
//       return;
//     }

//     department.name = req.body.name;
//     department.cpf = req.body.cpf;
//     department.department = req.body.department;
//     department.workShift = req.body.workShift;
//     department.workSchedule = req.body.workSchedule;

//     await department.save();

//     res.status(200).send();
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update department" });
//   }
// });

// departmentRouter.delete("/department/:id", async (req: Request, res: Response) => {
//   const departmentId = req.params.id;
//   try {
//     const department = await searchEmployeeById(departmentId);
//     if (!department) {
//       res.status(404).json({ error: `Employee ${departmentId} not found!` });
//       return;
//     }

//     await Employee.deleteOne({ _id: departmentId });
//     res.status(200).json({
//       message: `Employee ${departmentId} - ${department.name} has been deleted successfully`,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete department" });
//   }
// });

// departmentRouter.put(
//   "/department/:id/workdays",
//   async (req: Request, res: Response) => {
//     const departmentId = req.params.id;
//     try {
//       const department = await searchEmployeeById(departmentId);
//       if (!department) {
//         res.status(404).json({ error: `Employee ${departmentId} not found` });
//         return;
//       }

//       const period = req.body.period;

//       await Employee.findByIdAndUpdate(departmentId, {
//         [`holidayWorkDays.${period}`]: req.body.holidayWorkDays,
//         [`weekendWorkDays.${period}`]: req.body.weekendWorkDays,
//         [`unjustifiedAbsences.${period}`]: req.body.unjustifiedAbsences,
//         [`unjustifiedAbsencesPreviousMonth.${period}`]:
//           req.body.unjustifiedAbsencesPreviousMonth,
//       });

//       res
//         .status(200)
//         .send(
//           `${department.name} - escala de fim de semanas e feriados atualizados`
//         );
//     } catch (error) {
//       res.status(500).json({ error: "Failed to update department" });
//     }
//   }
// );

// function instanceEmployeeFromRequest(req: Request) {
//   return new Employee({
//     name: req.body.name,
//     cpf: req.body.cpf,
//     department: req.body.department,
//     workShift: req.body.workShift,
//     workSchedule: req.body.workSchedule,
//   });
// }

async function verifyDepartmentExistence(name: string) {
  return await prisma.department.findUnique({
    where: {
      name,
    },
  });
}

// async function searchEmployeeById(departmentId: string) {
//   return await Employee.findById(departmentId);
// }

// async function saveEmployee(department: any, res: Response) {
//   try {
//     const existsEmployee = await Employee.findOneAndUpdate(
//       { _id: department._id },
//       department,
//       { upsert: true }
//     );
//     res
//       .status(existsEmployee ? 200 : 201)
//       .json({ message: "Employee saved successfully" });
//   } catch (error) {
//     console.log(error);
//     if (error instanceof mongoose.Error.ValidationError) {
//       res.status(400).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "Failed to save department" });
//     }
//   }
// }
