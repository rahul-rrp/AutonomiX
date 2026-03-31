import express from "express";
import {
  saveApiKeyController,
  getUserIntegrationsController,
  removeIntegrationController,
  googleOAuthStart,
  googleOAuthCallback,
} from "../controllers/integration.controller.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.post("/apikey", authMiddleware, saveApiKeyController);
router.get("/user", authMiddleware, getUserIntegrationsController);
router.delete("/:provider", authMiddleware, removeIntegrationController);
router.get("/google/connect", authMiddleware, googleOAuthStart);
router.get("/google/callback", googleOAuthCallback);
export default router;
