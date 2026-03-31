import { Request, Response } from "express";
import {
  createAgentConfig,
  getAgentConfigById,
  getAllAgentConfigs,
} from "../services/agentGenerator.service.js";

export const createAgentHandler = async (req: Request, res: Response) => {
  const { agent_name, goal } = req.body;

  const userId = req.userId;

  const genratedconfig = await createAgentConfig(agent_name, goal, userId);

  res.json(genratedconfig);
};

export const getAllAgentsHandler = async (req: Request, res: Response) => {
  const userId = req.userId;
  const agentConfigs = await getAllAgentConfigs(userId);
  res.json(agentConfigs);
};

export const getAgentByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const agentId = id as string;
  const userId = req.userId;
  const agentConfig = await getAgentConfigById(agentId, userId);
  if (!agentConfig) {
    return res.status(404).json({ error: "Agent config not found" });
  }
  res.json(agentConfig);
};

export const deleteMemoryHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ChromaClient } = await import("chromadb");
    const client = new ChromaClient();
    await client.deleteCollection({ name: `agent_memory_${id}` });
    res.status(200).json({ message: "Memory cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing memory" });
  }
};
