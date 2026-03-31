import express from "express";
import { authHandler } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/user", authHandler);

export default router;
