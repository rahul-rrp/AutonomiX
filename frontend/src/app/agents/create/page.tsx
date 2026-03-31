"use client";
import AgentBuilder from "@/components/agent/AgentBuilder";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top bar */}
      <div className="border-b border-border-soft bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-screen-xl px-6 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-2 font-mono text-[11px] text-text-muted uppercase tracking-widest">
            <Link href="/" className="hover:text-accent-cyan transition-colors">
              AutonomiX
            </Link>
            <span>/</span>
            <Link
              href="/agents"
              className="hover:text-accent-cyan transition-colors"
            >
              Agents
            </Link>
            <span>/</span>
            <span className="text-text-primary">New</span>
          </nav>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
              Agent Builder v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Back link */}
        <Link
          href="/agents"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-text-muted uppercase tracking-widest hover:text-accent-cyan transition-colors mb-8"
        >
          <ChevronLeft size={13} />
          Back to Agents
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[10px] text-accent-cyan uppercase tracking-[0.25em] mb-2">
            Initialize New System
          </p>
          <h1 className="text-3xl font-bold font-display text-text-primary tracking-tight">
            Deploy an Agent
          </h1>
          <p className="mt-2 font-mono text-sm text-text-muted max-w-lg">
            Define a name and goal — AutonomiX will automatically configure
            tools, memory, and role for your agent.
          </p>
        </div>

        {/* Builder */}
        <AgentBuilder />
      </div>
    </div>
  );
};

export default Page;
