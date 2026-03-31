import { prisma } from "../config/prisma.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SaveApiKeyParams = {
  userId: string;
  provider: string;
  apiKey: string;
  apiUrl?: string;
  apiName?: string;
};

// ─── Save API Key ─────────────────────────────────────────────────────────────

export const saveApiKey = async (payload: SaveApiKeyParams) => {
  const { userId, provider, apiKey, apiUrl, apiName } = payload;

  try {
    const integration = await prisma.userIntegration.upsert({
      where: { userId_provider: { userId, provider } },
      update: { apiKey, apiUrl, apiName, authType: "apikey", isActive: true },
      create: { userId, provider, authType: "apikey", apiKey, apiUrl, apiName },
    });

    return integration;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to save API key: ${err.message}`);
  }
};

// ─── Save OAuth Token ─────────────────────────────────────────────────────────

export const saveOAuthToken = async (
  userId: string,
  provider: string,
  refreshToken: string,
  accessToken?: string,
) => {
  try {
    const userInDb = await prisma.user.findUnique({
      where: { id: userId },
    });
    const integration = await prisma.userIntegration.upsert({
      where: { userId_provider: { userId, provider } },
      update: { refreshToken, accessToken, authType: "oauth", isActive: true },
      create: {
        userId,
        provider,
        authType: "oauth",
        refreshToken,
        accessToken,
      },
    });

    return integration;
  } catch (error) {
    const err = error as Error;
    console.log(err);
    throw new Error(`Failed to save OAuth token: ${err.message}`);
  }
};

// ─── Get All Integrations for User ───────────────────────────────────────────

export const getUserIntegrations = async (userId: string) => {
  try {
    const integrations = await prisma.userIntegration.findMany({
      where: { userId, isActive: true },
      select: {
        provider: true,
        authType: true,
        apiName: true,
        createdAt: true,
        // ✅ never return tokens to frontend
      },
    });

    return integrations;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to get integrations: ${err.message}`);
  }
};

// ─── Get Single Integration Token (for agentExecutor) ────────────────────────

export const getIntegrationToken = async (userId: string, provider: string) => {
  try {
    const integration = await prisma.userIntegration.findUnique({
      where: { userId_provider: { userId, provider } },
    });

    if (!integration?.isActive) return null;
    return integration;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to get integration: ${err.message}`);
  }
};

// ─── Remove Integration ───────────────────────────────────────────────────────

export const removeIntegration = async (userId: string, provider: string) => {
  try {
    await prisma.userIntegration.update({
      where: { userId_provider: { userId, provider } },
      data: { isActive: false },
    });

    return { message: "Integration removed" };
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to remove integration: ${err.message}`);
  }
};
