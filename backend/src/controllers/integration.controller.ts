import { Request, Response } from "express";
import { google } from "googleapis";
import {
  saveApiKey,
  saveOAuthToken,
  getUserIntegrations,
  removeIntegration,
} from "../services/integration.service.js";
import { prisma } from "../config/prisma.js";
// ─── Save API Key ─────────────────────────────────────────────────────────────

export const saveApiKeyController = async (req: Request, res: Response) => {
  const userId = req.userId; // ✅ from middleware
  const { provider, apiKey, apiUrl, apiName } = req.body;

  if (!userId || !provider || !apiKey) {
    return res.status(400).json({ message: "provider and apiKey required" });
  }

  const payload = {
    userId,
    provider,
    apiKey,
    apiUrl,
    apiName,
  };
  try {
    const data = await saveApiKey(payload);
    return res.status(200).json({ data, message: "Integration saved" });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
};

// ─── Get User Integrations ────────────────────────────────────────────────────

export const getUserIntegrationsController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId; // ✅ from middleware

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const data = await getUserIntegrations(userId);
    return res.status(200).json({ data });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
};

// ─── Remove Integration ───────────────────────────────────────────────────────

export const removeIntegrationController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId; // ✅ from middleware
  const { provider } = req.params; // only provider from params now

  if (!userId || !provider) {
    return res.status(400).json({ message: "provider required" });
  }

  try {
    const data = await removeIntegration(userId, provider as string);
    return res.status(200).json({ data });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
};

// ─── Google OAuth Start ───────────────────────────────────────────────────────

export const googleOAuthStart = (req: Request, res: Response) => {
  const userId = req.userId; // ✅ from middleware
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  const state = Buffer.from(JSON.stringify({ userId })).toString("base64");

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
    state,
  });

  return res.status(200).json({ url: authUrl });
};

// ─── Google OAuth Callback ────────────────────────────────────────────────────

export const googleOAuthCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  try {
    const { userId } = JSON.parse(
      Buffer.from(state as string, "base64").toString(),
    );

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    const { tokens } = await oauth2Client.getToken(code as string);

    if (!tokens.refresh_token) {
      return res.status(400).send("No refresh token. Try again.");
    }
    const cleanUserId = userId.trim();

    await saveOAuthToken(
      cleanUserId,
      "google_calendar",
      tokens.refresh_token,
      tokens.access_token ?? undefined,
    );
    return res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/api/integrations?connected=google_calendar`,
    );
  } catch (error) {
    const err = error as Error;
    return res.status(500).send(`OAuth error: ${err.message}`);
  }
};
