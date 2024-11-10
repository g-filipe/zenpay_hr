import express, { Request, Response } from "express";
import { prisma } from "@db/prisma.js";

export const departmentRouter = express.Router();

departmentRouter.get("/department", async (_, res: Response) => {
  try {
    const departmentList = await prisma.department.findMany({
      include: {
        leader: {
          select: {
            name: true,
          },
        },
        employees: {
          select: {
            employee: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(departmentList);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve department list" });
  }
});

departmentRouter.get("/department/:id", async (req: Request, res: Response) => {
  const departmentId = Number(req.params.id);

  try {
    const department = await findDepartmentById(departmentId);

    if (!department) {
      res.status(404).json({ error: "Department not found" });
      return;
    }

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve department" });
  }
});

departmentRouter.post("/department", async (req: Request, res: Response) => {
  try {
    const departmentExistence = await verifyDepartmentExistence(req.body.name);

    if (departmentExistence) {
      res.status(400).json({ error: "Department already registered" });
      return;
    }

    const department = await prisma.department.create({
      data: {
        name: req.body.name,
        leader_id: req.body.leader_id,
      },
      select: {
        name: true,
        leader_id: true,
        leader: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Registered Successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register department" });
  }
});

departmentRouter.put("/department/:id", async (req: Request, res: Response) => {
  const departmentId = Number(req.params.id);
  try {
    const departmentExistence = await findDepartmentById(departmentId);
    if (!departmentExistence) {
      res.status(404).json({ error: `Department ${departmentId} not found` });
      return;
    }

    const updatedDepartment = await prisma.department.update({
      where: {
        id: departmentId,
      },
      data: {
        name: req.body.name,
        leader_id: req.body.leader_id,
      },
      select: {
        id: true,
        name: true,
        leader_id: true,
        leader: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Updated Successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update department" });
  }
});

departmentRouter.delete(
  "/department/:id",
  async (req: Request, res: Response) => {
    const departmentId = Number(req.params.id);

    try {
      const departmentExistence = await findDepartmentById(departmentId);
      if (!departmentExistence) {
        res
          .status(404)
          .json({ error: `Department ${departmentId} not found!` });
        return;
      }

      await prisma.department.delete({
        where: {
          id: departmentId,
        },
      });

      res.status(200).json({
        message: `Department ${departmentId} - ${departmentExistence.name} has been deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete department" });
    }
  }
);

async function verifyDepartmentExistence(name: string) {
  return await prisma.department.findUnique({
    where: {
      name,
    },
  });
}

async function findDepartmentById(id: number) {
  return await prisma.department.findUnique({
    where: {
      id,
    },
    include: {
      leader: {
        select: {
          name: true,
        },
      },
      employees: {
        select: {
          employee: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
