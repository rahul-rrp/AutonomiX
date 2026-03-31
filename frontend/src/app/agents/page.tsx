"use client";
import React from "react";
import ExampleCard from "@/components/hero/ExampleCard";
import { useAllAgents } from "@/hooks/useAgents";
import { Plus, Bot, Cpu, RefreshCw } from "lucide-react";
import Link from "next/link";

type AgentData = {
  id: string;
  name: string;
  role: string;
  memoryEnabled: boolean;
  tools: string[];
};

const Page = () => {
  const { data: agents = [], isLoading, error, refetch } = useAllAgents();

  return (
    <section className="bg-bg-primary min-h-screen antialiased">
      {/* Top bar */}
      <div className="border-b border-border-soft bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-screen-xl px-6 py-3 flex items-center justify-between">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-mono text-[11px] text-text-muted uppercase tracking-widest">
            <Link href="/" className="hover:text-accent-cyan transition-colors">
              AutonomiX
            </Link>
            <span>/</span>
            <span className="text-text-primary">Agents</span>
          </nav>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
              {isLoading ? "Fetching..." : `${agents.length} agents online`}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-6 py-10">
        {/* Page header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] text-accent-cyan uppercase tracking-[0.25em] mb-2">
              Deployed Systems
            </p>
            <h1 className="text-3xl font-bold font-display text-text-primary tracking-tight">
              Your Intelligent Agents
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-3 py-2 rounded-md border border-border-soft bg-bg-secondary font-mono text-[11px] text-text-muted uppercase tracking-widest hover:text-text-primary hover:border-border-strong transition-all"
            >
              <RefreshCw size={12} />
              Refresh
            </button>
            <Link
              href="/agents/create"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent-cyan text-bg-primary font-mono text-[11px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
            >
              <Plus size={13} />
              New Agent
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-lg border border-border-soft bg-bg-secondary animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center h-64 gap-4 border border-red-500/20 rounded-lg bg-red-500/5">
            <Cpu size={32} className="text-red-400/50" />
            <p className="font-mono text-sm text-red-400 uppercase tracking-widest">
              Connection Failed
            </p>
            <button
              onClick={() => refetch()}
              className="font-mono text-[11px] text-text-muted uppercase tracking-widest hover:text-text-primary transition-colors"
            >
              [ Retry ]
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && agents.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4 border border-dashed border-border-soft rounded-lg">
            <Bot size={36} className="text-text-disabled" />
            <p className="font-mono text-sm text-text-muted uppercase tracking-widest">
              No agents deployed yet
            </p>
            <Link
              href="/"
              className="font-mono text-[11px] text-accent-cyan uppercase tracking-widest hover:brightness-110 transition-colors"
            >
              [ Create your first agent → ]
            </Link>
          </div>
        )}

        {/* Agents grid */}
        {!isLoading && !error && agents.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {agents?.map((agent: AgentData, i: number) => (
              <div
                key={agent.id}
                className="anim"
                style={{
                  opacity: 0,
                  animation: "fadeUp 0.5s ease forwards",
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <ExampleCard cardData={agent} />
              </div>
            ))}

            {/* Create new placeholder */}
            <Link
              href="/agents/create"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-soft hover:border-accent-cyan/40 cursor-pointer group transition-all min-h-[220px]"
            >
              <div className="rounded-full bg-bg-tertiary p-4 border border-dashed border-border-soft group-hover:border-accent-cyan/40 group-hover:bg-accent-cyan/5 transition-all">
                <Plus
                  size={18}
                  className="text-text-muted group-hover:text-accent-cyan transition-colors"
                />
              </div>
              <p className="mt-3 font-mono text-[11px] text-text-muted uppercase tracking-widest group-hover:text-accent-cyan transition-colors">
                Deploy New Agent
              </p>
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Page;
