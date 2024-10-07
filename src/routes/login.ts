import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

export const loginRouter = express.Router();

loginRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await searchUserByEmail(req.body.email);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.status(401).json({ error: "Login failed: Invalid login/password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

async function searchUserByEmail(email: string) {
  return await User.findOne({ email });
}
