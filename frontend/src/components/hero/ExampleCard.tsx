"use client";
import React, { useState } from "react";
import { Play, Trash2, Bot, Wrench, Brain, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAgentStore } from "@/store/useAgentStore";
import { useQueryClient } from "@tanstack/react-query";

type cardProps = {
  cardData: {
    id: string;
    name: string;
    role: string;
    memoryEnabled: boolean;
    tools: string[];
  };
};

const ExampleCard: React.FC<cardProps> = ({ cardData }) => {
  const router = useRouter();
  const setActiveAgent = useAgentStore((state) => state.setActiveAgent);
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const onRunHandle = () => {
    setActiveAgent(cardData);
    router.push(`/runs?id=${cardData.id}`);
  };
  // const activeAgent = useAgentStore((state) => state.activeAgent);
  // const clearAgent = useAgentStore((state) => state.clearActiveAgent);
  // if (activeAgent?.id === cardData.id) {
  //   clearAgent();
  // }

  const onDeleteHandle = async () => {
    if (!confirm(`Delete agent "${cardData.name}"?`)) return;
    setDeleting(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/${cardData.id}`, {
        method: "DELETE",
      });
      queryClient.invalidateQueries({ queryKey: ["agents"] }); // ✅ refreshes list
    } catch (e) {
      console.error("Delete failed", e);
      setDeleting(false);
    }
  };

  return (
    <div className="group relative flex h-full flex-col rounded-lg border border-border-soft bg-bg-secondary p-5 font-mono text-text-primary transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-2xl overflow-hidden">
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(0,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex items-center gap-2">
          {cardData.memoryEnabled && (
            <span className="flex items-center gap-1 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-2 py-0.5 text-[9px] font-medium text-accent-cyan uppercase tracking-widest">
              <Brain size={9} />
              Memory
            </span>
          )}
        </div>
      </div>

      {/* Visual area — unique per agent using name initial */}
      <div className="mb-4 flex h-28 w-full items-center justify-center rounded-md bg-bg-tertiary border border-border-soft relative overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-bg-secondary text-xl font-bold text-text-primary group-hover:border-accent-cyan/40 transition-colors">
            {cardData.name.charAt(0).toUpperCase()}
          </div>
          <Zap
            size={10}
            className="text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"
          />
        </div>
      </div>

      {/* Name */}
      <h2 className="mb-1 text-sm font-bold leading-tight tracking-wide text-text-primary group-hover:text-accent-cyan transition-colors">
        {cardData.name}
      </h2>

      {/* Role */}
      <p className="mb-4 flex-grow text-xs leading-relaxed text-text-muted line-clamp-2">
        {cardData.role}
      </p>

      {/* Tools */}
      {cardData.tools.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {cardData.tools.map((tool) => (
            <span
              key={tool}
              className="flex items-center gap-1 rounded border border-border-soft bg-bg-tertiary px-1.5 py-0.5 text-[9px] text-text-muted uppercase tracking-widest"
            >
              <Wrench size={8} />
              {tool.replace("_", " ")}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-border-soft mb-4" />

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRunHandle}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent-cyan py-2.5 text-bg-primary font-bold text-[11px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
        >
          <Play size={13} fill="currentColor" />
          Run Agent
        </button>
        <button
          type="button"
          onClick={onDeleteHandle}
          disabled={deleting}
          className="flex items-center justify-center rounded-md border border-border-soft bg-transparent px-3 py-2.5 text-text-muted transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 active:scale-95 disabled:opacity-30"
        >
          <Trash2 size={14} className={deleting ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
};

export default ExampleCard;
