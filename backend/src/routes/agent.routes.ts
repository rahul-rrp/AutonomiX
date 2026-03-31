import express from "express";
import {
  runAgentHandler,
  streamAgentHandler,
  getAgentHistoryHandler,
} from "../controllers/agent.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/run", authMiddleware, runAgentHandler);
router.post("/run/stream", authMiddleware, streamAgentHandler);
router.get("/:id/run", authMiddleware, getAgentHistoryHandler);

export default router;
