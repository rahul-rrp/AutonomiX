import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
import { prisma } from "../config/prisma.js";
type Agent = {
  id: string;
  name: string;
  role: string;
  tools: string[];
  memoryEnabled: boolean;
};

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function generateAgentConfig(userPromt: string) {
  const systemPrompt = `
    You are an AI Agent Architect.
    
    Based on the user's request, generate a JSON configuration for an AI agent.
    
    Allowed tools:
    - web_search
    - calculator
    - pdf_generator
    - summarizer
    - send_email
    - google_calendar
    Do not include explanations.
    Do not include markdown.
    Return ONLY valid JSON in this format:
    
    {
      "name": "Agent Name",
      "role": "Clear description of the agent's purpose",
      "tools": ["tool1", "tool2"],
      "memoryEnabled": true
    }
    `;

  const conversation = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPromt },
  ];
  const response = await model.invoke(conversation);
  const rawContent = response.content as string;

  console.log("RAW LLM OUTPUT:", rawContent);
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Invalid JSON returned from LLM");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return parsed as Agent;
}

export async function createAgentConfig(
  name: string,
  promt: string,
  userId: string,
) {
  // Save the agent config to the database or in-memory store

  const agent = await generateAgentConfig(promt);
  const savedAgent = await prisma.agentConfig.create({
    data: {
      name: name,
      role: agent.role,
      tools: agent.tools,
      memoryEnabled: agent.memoryEnabled,
      userId: userId,
    },
  });

  return savedAgent;
}

export async function getAgentConfigById(id: string, userId: string) {
  return await prisma.agentConfig.findUnique({ where: { id, userId: userId } });
}

export async function getAllAgentConfigs(userId: string) {
  const agentConfigs = await prisma.agentConfig.findMany({
    where: { userId: userId },
  });
  return agentConfigs;
}
