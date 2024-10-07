import express, { Request, Response } from "express";
import { User } from "../models/user.js";
import mongoose from "mongoose";
import { encryptPassword } from "../password.js";

export const userRouter = express.Router();

userRouter.get("/user", async (_, res: Response) => {
  try {
    const userList = await User.find();
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user list" });
  }
});

userRouter.get("/user/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: `User ${userId} not found!` });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

userRouter.post("/user", async (req: Request, res: Response) => {
  try {
    const newUser = instanceUserFromRequest(req);
    const user = await searchUserByEmail(newUser.email);
    if (user) {
      res.status(400).json({ error: "Email already in use" }); //!
      return;
    }
    await saveUser(newUser, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

userRouter.put("/user/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await searchUserById(userId);
    if (!user) {
      res.status(404).json({ error: `User ${userId} not found` });
      return;
    }

    const updatedUser = instanceUserFromRequest(req);
    updatedUser._id = new mongoose.Types.ObjectId(userId);
    await saveUser(updatedUser, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

userRouter.delete("/user/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: `User ${userId} not found!` });
      return;
    }

    await User.deleteOne({ _id: userId });
    res.status(200).json({
      message: `User ${userId} - ${user.name} has been deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

function instanceUserFromRequest(req: Request) {
  return new User({
    name: req.body.name,
    email: req.body.email,
    password: encryptPassword(req.body.password),
  });
}

async function searchUserByEmail(email: string) {
  return await User.findOne({ email });
}

async function searchUserById(userId: string) {
  return await User.findById(userId);
}

async function saveUser(user: any, res: Response) {
  try {
    const existsUser = await User.findOneAndUpdate({ _id: user._id }, user, {
      upsert: true,
    });
    res
      .status(existsUser ? 200 : 201)
      .json({ message: "User saved successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to save user" });
    }
  }
}
