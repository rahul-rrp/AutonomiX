import express from "express";
import {
  createAgentHandler,
  getAllAgentsHandler,
  getAgentByIdHandler,
  deleteMemoryHandler,
} from "../controllers/agentCreation.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", authMiddleware, createAgentHandler);
router.get("/", authMiddleware, getAllAgentsHandler);
router.get("/:id", authMiddleware, getAgentByIdHandler);
router.delete("/:id/memory", authMiddleware, deleteMemoryHandler);

export default router;
