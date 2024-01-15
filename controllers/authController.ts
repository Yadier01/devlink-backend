import jwt from "jsonwebtoken";
import { z } from "zod";
import type { Request, Response } from "express";
import { type IUser } from "../models/User";
import { User } from "../schemas/allSchemas";

const signupSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(6),
});

const loginSchema = z.object({
  name: z.string(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const { name, password } = signupSchema.parse(req.body);

    const uniqueUser = await User.findOne({ name: { $eq: name } });

    if (uniqueUser) {
      res.status(400).send({ error: "User already exists" });
      return;
    }

    const bcryptHash = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 12,
    });

    const user: IUser = new User({
      name,
      password: bcryptHash,
    });

    await user.save();

    res
      .status(201)
      .json({ status: 201, message: "User registered successfully" });
  } catch (error: any) {
    console.error("Error in register route", error);
    res.status(500).send({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { name, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ name: { $eq: name } });

    if (!user) {
      res.status(400).send({ error: "Invalid credentials" });
      return;
    }

    const validPassword = await Bun.password.verify(password, user.password);
    if (!validPassword) {
      res.status(400).send({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

    res.json({
      message: "success",
      token,
      name: user.name,
    });
  } catch (err: any) {
    console.error("Error in login route", err);
    res.status(500).send({ error: err.message });
  }
};
