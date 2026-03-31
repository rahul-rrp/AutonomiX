import { Request, Response } from "express";
import { runAgent } from "../agents/agentExecutor.js";
import { getAgentRunHistoryService } from "../services/agent.service.js";

export const runAgentHandler = async (req: Request, res: Response) => {
  const { id, task, history } = req.body;
  const userId = req.userId;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  const result = await runAgent(id, task, history ?? [], () => {}, userId); // ✅ no-op emit
  return res.json({ data: result });
};

export const streamAgentHandler = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // ✅ flush immediately so browser knows stream started

  // Automatically parsed by express.json()
  const id = req.body.id as string;
  const task = req.body.task as string;
  const history = req.body.history || []; // It's already an array!
  const userID = req.userId;

  if (!id || !task) {
    res.write(
      `data: ${JSON.stringify({ type: "error", message: "id and task required" })}\n\n`,
    );
    res.end();
    return;
  }

  const send = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // Pass history directly, no need for JSON.parse()
    await runAgent(id, task, history, send, userID);
  } catch (error) {
    console.error("Agent Run Error:", error);
    send({
      type: "error",
      message: "An error occurred while running the agent.",
    });
  } finally {
    res.end();
  }
};
export const getAgentHistoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const agentId = id as string;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Agent ID is required",
    });
  }

  try {
    const history = await getAgentRunHistoryService(agentId);

    return res.status(200).json({
      success: true,
      message: "History retrieved successfully",
      data: history,
    });
  } catch (error) {
    console.error("Error fetching agent history:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
