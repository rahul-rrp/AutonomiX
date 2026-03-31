import { prisma } from "../config/prisma.js";

export const getAgentRunHistoryService = async (agentId: string) => {
  return await prisma.agentRun.findMany({
    where: { agentId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
};
