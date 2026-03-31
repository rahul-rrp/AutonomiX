import { Request, Response } from "express";
import { upsertUser } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import console from "node:console";

export const authHandler = async (req: Request, res: Response) => {
  const { googleId, email, name, image } = req.body;

  try {
    console.log("🔥 UPSERT START");
    const user = await upsertUser(googleId, email, name, image);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: 30 * 24 * 60 * 60,
    });
    console.log("✅ USER CREATED:", user, token);
    return res.status(200).json({ data: user, token });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
};
