"use client";

import { useState } from "react";
import {
  Wrench,
  Search,
  Calculator,
  FileText,
  Mail,
  Calendar,
  Settings,
  Plus,
  Link as LinkIcon,
} from "lucide-react";
import { useIntegrations } from "../../hooks/useAgents";
import IntegrationModal from "../../components/tools/IntegrationModal";

export default function ToolsPage() {
  const { data: integrations = [], isLoading } = useIntegrations();
  const [selectedTool, setSelectedTool] = useState<any | null>(null);

  const tools = [
    {
      name: "Web Search",
      description:
        "Search the internet for current events, facts, and live data.",
      icon: Search,
      requiresIntegration: false,
      provider: "tavily",
      authType: "apikey",
    },
    {
      name: "Calculator",
      description:
        "Evaluate mathematical expressions and perform calculations.",
      icon: Calculator,
      requiresIntegration: false,
    },
    {
      name: "Summarizer",
      description:
        "Condense long documents or articles into key bullet points.",
      icon: FileText,
      requiresIntegration: false,
    },
    {
      name: "PDF Generator",
      description: "Generate beautiful PDF reports from markdown content.",
      icon: FileText,
      requiresIntegration: false,
    },
    {
      name: "Email Sender",
      description: "Send emails to any address via SMTP integration.",
      icon: Mail,
      requiresIntegration: true,
      provider: "sendgrid",
      authType: "apikey",
    },
    {
      name: "Google Calendar",
      description:
        "Read and create Google Calendar events. Great for scheduling assistants.",
      icon: Calendar,
      requiresIntegration: true,
      provider: "google_calendar",
      authType: "oauth",
    },
  ];

  const getToolIntegration = (provider?: string) => {
    if (!provider) return null;
    return integrations.find((i) => i.provider === provider) || null;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full font-mono">
      <div className="mb-8 border-b border-border-soft pb-6">
        <h1 className="text-2xl font-bold text-text-primary uppercase tracking-widest flex items-center gap-3">
          <Wrench className="text-accent-cyan" />
          Tool Registry
        </h1>
        <p className="text-text-muted mt-3 text-sm max-w-3xl leading-relaxed">
          Manage the external capabilities available to your autonomous agents.
          Configure third-party integrations to grant agents access to web
          search, email, and calendars.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-accent-cyan">
          <Wrench className="animate-spin text-accent-cyan mr-3" size={24} />
          <span className="uppercase tracking-widest">
            Loading Integrations...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool, i) => {
            const integration = tool.requiresIntegration
              ? getToolIntegration(tool.provider)
              : null;
            const isActive = !tool.requiresIntegration || !!integration;

            return (
              <div
                key={i}
                className={`bg-bg-secondary border rounded-lg p-6 transition-all duration-300 group relative overflow-hidden flex flex-col h-full ${
                  isActive
                    ? "border-border-soft hover:border-accent-cyan/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.05)]"
                    : "border-border-soft/50 opacity-80 hover:opacity-100"
                }`}
              >
                {/* Grid background effect */}
                <div
                  className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                />

                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div
                    className={`h-12 w-12 bg-bg-tertiary rounded-lg flex items-center justify-center border transition-all duration-300 ${
                      isActive
                        ? "border-border-soft group-hover:bg-accent-cyan/10 group-hover:border-accent-cyan/30"
                        : "border-border-soft/50 grayscale opacity-70"
                    }`}
                  >
                    <tool.icon
                      className={`transition-colors ${isActive ? "text-text-muted group-hover:text-accent-cyan" : "text-text-disabled"}`}
                      size={24}
                    />
                  </div>

                  {isActive ? (
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-text-disabled bg-bg-tertiary px-2.5 py-1 rounded-full border border-border-soft">
                      Inactive
                    </span>
                  )}
                </div>

                <h3
                  className={`text-base font-bold tracking-wide mb-2.5 relative z-10 transition-colors flex-grow-0 ${isActive ? "text-text-primary group-hover:text-accent-cyan" : "text-text-muted"}`}
                >
                  {tool.name}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed relative z-10 flex-grow">
                  {tool.description}
                </p>

                {tool.requiresIntegration && (
                  <div className="mt-5 pt-4 border-t border-border-soft/50 relative z-10">
                    <button
                      onClick={() => setSelectedTool(tool)}
                      className={`w-full py-2 px-3 rounded text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all ${
                        integration
                          ? "bg-bg-tertiary text-text-muted hover:text-white border border-border-soft hover:border-accent-cyan/30"
                          : "bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 border border-accent-cyan/20"
                      }`}
                    >
                      {integration ? (
                        <>
                          <Settings size={14} /> Configure
                        </>
                      ) : (
                        <>
                          <LinkIcon size={14} /> Connect Setup
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedTool && (
        <IntegrationModal
          isOpen={!!selectedTool}
          onClose={() => setSelectedTool(null)}
          tool={selectedTool}
          integration={getToolIntegration(selectedTool.provider)}
        />
      )}
    </div>
  );
}
