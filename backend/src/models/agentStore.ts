type Agent = {
  id: string;
  name: string;
  role: string;
  tools: string[];
  memoryEnabled: boolean;
};

export const agents: Agent[] = [];

export function createAgent(agent: Agent) {
  agents.push(agent);
  return agent;
}

export function getAgentById(id: string) {
  return agents.find((a) => a.id === id);
}

export function getAllAgents() {
  return agents;
}
