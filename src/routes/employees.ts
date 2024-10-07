import express, { Request, Response } from "express";
import { Employee } from "../models/employee.js";
import mongoose from "mongoose";

export const employeeRouter = express.Router();

employeeRouter.get("/employee", async (_, res: Response) => {
  try {
    const employeeList = await Employee.find();
    res.status(200).json(employeeList);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve employee list" });
  }
});

employeeRouter.get("/employee/:id", async (req: Request, res: Response) => {
  const employeeId = req.params.id;
  try {
    const employee = await Employee.findById(employeeId);
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
    const newEmployee = instanceEmployeeFromRequest(req);
    const employee = await searchEmployeeByCpf(newEmployee.cpf);
    if (employee) {
      res.status(400).json({ error: "CPF already in use" });
      return;
    }
    await saveEmployee(newEmployee, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to register employee" });
  }
});

employeeRouter.put("/employee/:id", async (req: Request, res: Response) => {
  const employeeId = req.params.id;
  try {
    const employee = await searchEmployeeById(employeeId);
    if (!employee) {
      res.status(404).json({ error: `Employee ${employeeId} not found` });
      return;
    }

    const updatedEmployee = instanceEmployeeFromRequest(req);
    updatedEmployee._id = new mongoose.Types.ObjectId(employeeId);
    await saveEmployee(updatedEmployee, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to update employee" });
  }
});

employeeRouter.delete("/employee/:id", async (req: Request, res: Response) => {
  const employeeId = req.params.id;
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404).json({ error: `Employee ${employeeId} not found!` });
      return;
    }

    await Employee.deleteOne({ _id: employeeId });
    res.status(200).json({
      message: `Employee ${employeeId} - ${employee.name} has been deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

function instanceEmployeeFromRequest(req: Request) {
  return new Employee({
    name: req.body.name,
    cpf: req.body.cpf,
    department: req.body.department,
    workShift: req.body.workShift,
    workSchedule: req.body.workSchedule,
  });
}

async function searchEmployeeByCpf(cpf: string) {
  return await Employee.findOne({ cpf });
}

async function searchEmployeeById(employeeId: string) {
  return await Employee.findById(employeeId);
}

async function saveEmployee(employee: any, res: Response) {
  try {
    const existsEmployee = await Employee.findOneAndUpdate(
      { _id: employee._id },
      employee,
      { upsert: true }
    );
    res
      .status(existsEmployee ? 200 : 201)
      .json({ message: "Employee saved successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to save employee" });
    }
  }
}
