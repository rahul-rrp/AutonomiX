"use client";
import React from "react";
import HeroHeader from "../components/hero/HeroHeader";
import AgentBuilder from "@/components/agent/AgentBuilder";

export default function Page() {
  return (
    <div className="min-h-screen bg-bg-primary ">
      {/* ✅ Reduced padding on hero */}
      <HeroHeader />

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">
            Create New Agent
          </span>
          <div className="flex-1 h-px bg-border-soft" />
        </div>

        <AgentBuilder />
      </div>
    </div>
  );
}
