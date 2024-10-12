import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token missing." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
    return;
  }
};
