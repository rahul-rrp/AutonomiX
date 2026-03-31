"use client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  createAgentApi,
  getAgents,
  getRunHistory,
  runAgent,
  getIntegrations,
  saveApiKey,
  removeIntegration,
  type AgentResponse,
  type Integration,
  type SaveApiKeyParams,
} from "../services/agentApis";

interface CreateAgentVariables {
  agent_name: string;
  goal: string;
}

interface RunAgentVariables {
  id: string;
  task: string;
  history: { role: string; content: string }[];
}

// ─── Agent Hooks ──────────────────────────────────────────────────────────────

export const useCreateAgent = (
  options?: UseMutationOptions<AgentResponse, Error, CreateAgentVariables>,
) => {
  return useMutation<AgentResponse, Error, CreateAgentVariables>({
    mutationFn: createAgentApi,
    ...options,
  });
};

export const useAllAgents = () => {
  return useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useRunAgent = (
  options?: UseMutationOptions<AgentResponse, Error, RunAgentVariables>,
) => {
  return useMutation<AgentResponse, Error, RunAgentVariables>({
    mutationFn: runAgent,
    ...options,
  });
};

export const useAgentRuns = (agentId: string) => {
  return useQuery({
    queryKey: ["runs", agentId],
    queryFn: () => getRunHistory(agentId),
    enabled: !!agentId,
    staleTime: 1000 * 30,
  });
};

// ─── Integration Hooks ────────────────────────────────────────────────────────

export const useIntegrations = () => {
  return useQuery<Integration[], Error>({
    queryKey: ["integrations"],
    queryFn: async () => {
      const res = await getIntegrations();

      return Array.isArray(res) ? res : [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useSaveApiKey = (
  options?: Omit<
    UseMutationOptions<unknown, Error, SaveApiKeyParams>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, SaveApiKeyParams>({
    ...options, // Spread options first to default them
    mutationFn: saveApiKey,
    onSuccess: async (data, variables, context, mutation) => {
      // 1. Refresh the cache
      await queryClient.invalidateQueries({ queryKey: ["integrations"] });

      // 2. Pass all 4 arguments to fix the TS2554 error
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation);
      }
    },
  });
};

export const useRemoveIntegration = (
  options?: Omit<UseMutationOptions<unknown, Error, string>, "mutationFn">,
) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: removeIntegration, // string = provider
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      options?.onSuccess?.(data, variables, context, mutation);
    },
    ...options,
  });
};
