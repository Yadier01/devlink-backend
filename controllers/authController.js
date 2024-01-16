import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../schemas/allSchemas.js";
import bcrypt from "bcrypt";
const signupSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(6),
});

const loginSchema = z.object({
  name: z.string(),
  password: z.string(),
});

export const register = async (req, res) => {
  try {
    const { name, password } = signupSchema.parse(req.body);

    const uniqueUser = await User.findOne({ name: { $eq: name } });

    if (uniqueUser) {
      res.status(400).send({ error: "User already exists" });
      return;
    }

    const bcryptHash = await bcrypt.hash(password, 13);

    const user = new User({
      name,
      password: bcryptHash,
    });

    await user.save();

    res
      .status(201)
      .json({ status: 201, message: "User registered successfully" });
  } catch (error) {
    console.error("Error in register route", error);
    res.status(500).send({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { name, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ name: { $eq: name } });

    if (!user) {
      res.status(400).send({ error: "Invalid credentials" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).send({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      message: "success",
      token,
      name: user.name,
    });
  } catch (err) {
    console.error("Error in login route", err);
    res.status(500).send({ error: err.message });
  }
};
