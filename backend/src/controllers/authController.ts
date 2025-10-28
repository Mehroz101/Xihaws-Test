import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({ username, email, password: hashed });

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    res.json({ message: "Login successful", token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Login failed", error });
  }
};
