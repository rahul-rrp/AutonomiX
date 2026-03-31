"use client";

import { useAgentRuns } from "@/hooks/useAgents";
import { Clock, MessageSquare } from "lucide-react";

type AgentRun = {
  id: string;
  agentId: string;
  task: string;
  response: string;
  createdAt: string;
};

export default function SessionHistory({ agentId }: { agentId: string }) {
  const { data, isLoading } = useAgentRuns(agentId);
  const runs = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="font-mono text-xs text-text-disabled animate-pulse p-4">
        LOADING_HISTORY...
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="font-mono text-xs text-text-disabled p-4">
        NO_PREVIOUS_RUNS — start a conversation
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      <p className="font-mono text-[10px] text-text-disabled uppercase tracking-widest mb-3">
        Past Sessions ({runs.length})
      </p>
      {runs.map((run: AgentRun) => (
        <div
          key={run.id}
          className="border border-border-soft rounded-lg p-3 bg-bg-primary space-y-1 hover:border-accent-cyan/30 transition-colors"
        >
          {/* Task */}
          <div className="flex items-start gap-2">
            <MessageSquare size={10} className="text-green-400 mt-1 shrink-0" />
            <p className="font-mono text-[11px] text-green-400 leading-relaxed">
              ▶ {run.task}
            </p>
          </div>

          {/* Answer preview */}
          <div className="pl-4 font-mono text-[11px] text-text-muted leading-relaxed line-clamp-2 border-l border-border-soft ml-1">
            {(run.response ?? "No answer recorded").slice(0, 120)}
            {(run.response ?? "").length > 120 ? "..." : ""}
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-between pl-4 pt-1">
            <div className="flex items-center gap-1">
              <Clock size={9} className="text-text-disabled" />
              <span className="font-mono text-[9px] text-text-disabled">
                {new Date(run.createdAt).toLocaleString()}
              </span>
            </div>
            {/* Run number badge */}
            <span className="font-mono text-[9px] text-accent-cyan/40 uppercase tracking-widest">
              run #{runs.indexOf(run) + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
