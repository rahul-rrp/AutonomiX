"use client";

import React, { useRef, useState, useEffect, Children } from "react";
import {
  Square,
  Cpu,
  Activity,
  Zap,
  RotateCcw,
  Brain,
  Wrench,
  Database,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import SessionHistory from "./SessionHistory";
import { useAgentStore } from "@/store/useAgentStore";
import ReactMarkdown from "react-markdown";
import { streamAgentRun, SSEStep } from "@/services/agentApis";

// ─── Types ────────────────────────────────────────────────────────────────────

type LogEntry =
  | { kind: "system"; text: string }
  | { kind: "directive"; text: string; timestamp: string }
  | { kind: "step"; step: SSEStep }
  | { kind: "response"; text: string; timestamp: string }
  | { kind: "error"; text: string; timestamp: string };

// ─── Step Renderer ────────────────────────────────────────────────────────────

const StepRow: React.FC<{ step: SSEStep }> = ({ step }) => {
  if (step.type === "thinking") {
    return (
      <div className="flex items-center gap-2 text-yellow-400/80 text-[11px] font-mono pl-8">
        <Brain size={10} className="animate-pulse shrink-0" />
        <span className="uppercase tracking-widest">{step.message}</span>
      </div>
    );
  }

  if (step.type === "memory") {
    return (
      <div className="flex items-center gap-2 text-purple-400/80 text-[11px] font-mono pl-8">
        <Database size={10} className="shrink-0" />
        <span className="uppercase tracking-widest">
          {step.hasMemory
            ? `MEMORY_RETRIEVED — ${step.count} relevant context(s) loaded`
            : "MEMORY_EMPTY — no prior context found"}
        </span>
      </div>
    );
  }

  if (step.type === "tool_selected") {
    const inputText =
      typeof step.input === "string" ? step.input : JSON.stringify(step.input);
    return (
      <div className="pl-8 space-y-0.5">
        <div className="flex items-center gap-2 text-cyan-400 text-[11px] font-mono">
          <Zap size={10} className="shrink-0" />
          <span className="uppercase tracking-widest">
            TOOL_EXEC →{" "}
            <span className="text-white font-bold">{step.tool}</span>
          </span>
        </div>
        {step.reason && (
          <div className="pl-4 text-[10px] text-text-disabled font-mono italic">
            reason: {step.reason}
          </div>
        )}
        <div className="pl-4 text-[10px] text-text-muted font-mono">
          input:{" "}
          <span className="text-cyan-300/60">
            `{inputText?.slice(0, 80)}
            {inputText?.length > 80 ? "..." : ""}`
          </span>
        </div>
      </div>
    );
  }

  if (step.type === "tool_result") {
    return (
      <div className="pl-8 space-y-0.5">
        <div className="flex items-center gap-2 text-green-400 text-[11px] font-mono">
          <Wrench size={10} className="shrink-0" />
          <span className="uppercase tracking-widest">
            RESULT_RECEIVED{" "}
            <span className="text-green-300/60 text-[10px]">[{step.time}]</span>
          </span>
        </div>
        <div className="pl-4 text-[10px] text-text-disabled font-mono border-l border-green-900/50 ml-1">
          {step.result}
          {step.result.length >= 200 ? "…" : ""}
        </div>
      </div>
    );
  }

  if (step.type === "final") {
    return (
      <div className="flex items-center gap-2 text-accent-cyan text-[11px] font-mono pl-8">
        <CheckCircle size={10} className="shrink-0" />
        <span className="uppercase tracking-widest">
          ANSWER_READY — composing response
        </span>
      </div>
    );
  }

  if (step.type === "error") {
    return (
      <div className="flex items-center gap-2 text-red-400 text-[11px] font-mono pl-8">
        <AlertCircle size={10} className="shrink-0" />
        <span className="uppercase tracking-widest">ERROR: {step.message}</span>
      </div>
    );
  }

  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AgentExecutor: React.FC = () => {
  const [task, setTask] = useState("");
  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { kind: "system", text: "BOOTING_AUTONOMIX_OS..." },
    { kind: "system", text: "LINK_ESTABLISHED_WITH_CORE" },
    { kind: "system", text: "READY_FOR_DIRECTIVE" },
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // const eventSourceRef = useRef<EventSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeAgent = useAgentStore((state) => state.activeAgent);

  // Auto-scroll on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs, isRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  if (!activeAgent) {
    return (
      <div className="flex h-screen items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <div className="flex justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce" />
          </div>
          <p className="text-text-muted text-xs uppercase tracking-widest">
            [!] No active agent detected
          </p>
          <p className="text-text-disabled text-[10px] uppercase tracking-widest">
            Please select an agent from dashboard
          </p>
        </div>
      </div>
    );
  }

  const handleTaskInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTask(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    // if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const ts = new Date().toLocaleTimeString([], { hour12: false });
    setLogs((prev) => [
      ...prev,
      {
        kind: "error",
        text: "EXECUTION_CANCELLED — stopped by user",
        timestamp: ts,
      },
    ]);
    setIsRunning(false);
  };

  const handleClearSession = () => {
    abortControllerRef.current?.abort();
    setHistory([]);
    setIsRunning(false);
    setLogs([
      { kind: "system", text: "SESSION_CLEARED..." },
      { kind: "system", text: "MEMORY_WIPED" },
      { kind: "system", text: "READY_FOR_NEW_DIRECTIVE" },
    ]);
    setTask("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const toggleExecution = () => {
    if (!task.trim() || isRunning) return;

    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    const currentTask = task;
    const updatedHistory = [...history, { role: "user", content: currentTask }];

    setHistory(updatedHistory);
    setIsRunning(true);
    setTask("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setLogs((prev) => [
      ...prev,
      { kind: "directive", text: currentTask, timestamp },
    ]);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    streamAgentRun(
      { id: activeAgent.id, task: currentTask, history: updatedHistory },

      // onStep
      (step) => {
        if (step.type === "final") {
          const ts = new Date().toLocaleTimeString([], { hour12: false });
          setLogs((prev) => [
            ...prev,
            { kind: "step", step }, // ✅ ANSWER_READY row
            { kind: "response", text: step.answer, timestamp: ts }, // ✅ actual answer
          ]);
          setHistory((prev) => [
            ...prev,
            { role: "assistant", content: step.answer },
          ]);
          return; // don't fall through to generic step push
        }

        if (step.type === "error") {
          const ts = new Date().toLocaleTimeString([], { hour12: false });
          setLogs((prev) => [
            ...prev,
            { kind: "error", text: step.message, timestamp: ts },
          ]);
          return;
        }

        // thinking / memory / tool_selected / tool_result
        setLogs((prev) => [...prev, { kind: "step", step }]);
      },

      // onDone
      () => setIsRunning(false),

      // onError
      (msg) => {
        const ts = new Date().toLocaleTimeString([], { hour12: false });
        setLogs((prev) => [
          ...prev,
          { kind: "error", text: msg, timestamp: ts },
        ]);
      },
    );

    controller;
  };
  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 font-sans pb-12">
      <div className="relative rounded-xl border border-border-soft bg-bg-secondary shadow-lg overflow-hidden transition-all duration-300">
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-3 bg-bg-tertiary/50">
          <div className="flex items-center gap-4">
            {/* Mac dots */}
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500/60" />
              <span
                className={`h-2 w-2 rounded-full ${isRunning ? "bg-green-400 animate-pulse" : "bg-yellow-500/60"}`}
              />
              <span className="h-2 w-2 rounded-full bg-blue-500/60" />
            </div>

            {/* Agent name */}
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[10px] text-text-muted uppercase tracking-tighter">
                Active Agent:
              </span>
              <span className="text-xs text-accent-cyan font-bold leading-none tracking-tight">
                {activeAgent.name}
              </span>
            </div>

            {/* Agent tools */}
            {activeAgent.tools?.length > 0 && (
              <div className="hidden sm:flex gap-1">
                {activeAgent.tools.map((tool: string) => (
                  <span
                    key={tool}
                    className="px-1.5 py-0.5 rounded border border-border-soft bg-bg-primary text-[9px] font-mono text-text-disabled uppercase tracking-widest"
                  >
                    {tool.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClearSession}
              disabled={isRunning}
              title="Clear session"
              className="text-text-muted hover:text-text-primary transition-colors disabled:opacity-30"
            >
              <RotateCcw size={13} />
            </button>
            <Activity
              size={14}
              className={isRunning ? "text-green-400" : "text-text-muted"}
            />
          </div>
        </div>

        {/* ── Terminal Output ── */}
        <div
          className="relative bg-bg-primary h-[460px] p-6 font-mono text-[13px] overflow-y-auto terminal-scroll"
          ref={scrollRef}
        >
          {/* CRT scanline overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />

          <div className="space-y-2 relative z-0">
            {logs.map((entry, i) => {
              // ── System line
              if (entry.kind === "system") {
                return (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="text-text-disabled shrink-0 text-[10px] mt-0.5 font-mono">
                      [{i}]
                    </span>
                    <span className="text-text-secondary text-[12px]">
                      {entry.text}
                    </span>
                  </div>
                );
              }

              // ── User directive
              if (entry.kind === "directive") {
                return (
                  <div key={i} className="mt-4 space-y-1">
                    <div className="flex gap-4 items-start">
                      <span className="text-text-disabled shrink-0 text-[10px] mt-0.5 font-mono">
                        [{i}]
                      </span>
                      <div>
                        <span className="text-[10px] text-text-disabled font-mono">
                          [{entry.timestamp}] DIRECTIVE_RECEIVED
                        </span>
                        <p className="text-green-400 font-bold text-[13px] mt-0.5">
                          ▶ {entry.text}
                        </p>
                      </div>
                    </div>
                    {/* Divider under directive */}
                    <div className="ml-10 border-t border-border-soft/30" />
                  </div>
                );
              }

              // ── SSE step
              if (entry.kind === "step") {
                return (
                  <div key={i} className="py-0.5">
                    <StepRow step={entry.step} />
                  </div>
                );
              }

              // ── Final response
              if (entry.kind === "response") {
                return (
                  <div key={i} className="mt-3 ml-8 space-y-1">
                    <span className="text-[10px] text-text-disabled font-mono">
                      [{entry.timestamp}] RESPONSE
                    </span>
                    <div className="text-accent-cyan text-[13px] leading-relaxed">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <span className="block mb-1 last:mb-0">
                              {children}
                            </span>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-none space-y-1 mt-1">
                              {children}
                            </ul>
                          ),
                          li: ({ children }) => (
                            <li className="flex gap-2 items-start">
                              <span className="text-accent-cyan/50 shrink-0">
                                ▸
                              </span>
                              <span>{children}</span>
                            </li>
                          ),
                          strong: ({ children }) => (
                            <span className="text-text-primary font-bold">
                              {children}
                            </span>
                          ),
                          code: ({ children }) => (
                            <span className="px-1 py-0.5 rounded bg-bg-tertiary text-accent-cyan text-[11px]">
                              {children}
                            </span>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent-cyan underline underline-offset-2 hover:brightness-125 transition-all"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {entry.text}
                      </ReactMarkdown>
                    </div>
                    <div className="border-t border-border-soft/20 mt-2" />
                  </div>
                );
              }

              // ── Error
              if (entry.kind === "error") {
                return (
                  <div key={i} className="flex gap-4 items-start mt-2">
                    <span className="text-text-disabled shrink-0 text-[10px] mt-0.5 font-mono">
                      [{i}]
                    </span>
                    <span className="text-red-400 text-[12px]">
                      [{entry.timestamp}] ! ERROR: {entry.text}
                    </span>
                  </div>
                );
              }

              return null;
            })}

            {/* Processing animation */}
            {isRunning && (
              <div className="flex gap-4 items-center pl-8 mt-2">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-accent-cyan animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-accent-cyan animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-accent-cyan animate-bounce" />
                </div>
                <p className="text-accent-cyan/60 italic text-xs font-mono">
                  Processing neural weights...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Input Area ── */}
        <div className="p-4 bg-bg-secondary border-t border-border-soft">
          <div className="relative flex items-end gap-2 bg-bg-primary rounded-xl border border-border-soft p-3 focus-within:border-accent-cyan/40 transition-all duration-300 group">
            <div className="p-1.5 mb-1 text-text-disabled group-focus-within:text-accent-cyan transition-colors">
              <Cpu size={18} />
            </div>

            <textarea
              ref={textareaRef}
              value={task}
              onChange={handleTaskInput}
              rows={1}
              placeholder="Send a directive to your agent..."
              className="w-full terminal-scroll py-2 px-1 bg-transparent text-text-primary placeholder:text-text-disabled focus:ring-0 outline-none font-mono text-sm resize-none max-h-48 overflow-y-auto leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  toggleExecution();
                }
              }}
            />

            <div className="flex flex-col items-end gap-1.5 mb-1 shrink-0">
              {history.length > 0 && (
                <span className="text-[9px] font-mono text-accent-cyan/50 uppercase tracking-widest">
                  {history.length} msg
                </span>
              )}
              <button
                onClick={isRunning ? handleStop : toggleExecution} // ✅ correct
                disabled={!isRunning && !task.trim()} // ✅ never disabled when running
                className={`flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-200 active:scale-90
    ${
      isRunning
        ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
        : "bg-accent-cyan text-bg-primary hover:brightness-110 disabled:opacity-20 disabled:bg-bg-tertiary disabled:text-text-disabled"
    }`}
              >
                {isRunning ? (
                  <Square size={15} fill="currentColor" />
                ) : (
                  <Zap size={15} fill="currentColor" />
                )}
              </button>
            </div>
          </div>

          <details className="border border-border-soft rounded-xl mt-4 bg-bg-secondary">
            <summary className="px-5 py-3 font-mono text-[11px] text-text-muted uppercase tracking-widest cursor-pointer hover:text-text-primary transition-colors">
              📋 Session History
            </summary>
            <SessionHistory agentId={activeAgent.id} />
          </details>

          <div className="mt-2 flex items-center justify-between px-1">
            <span className="text-[9px] text-text-disabled font-mono uppercase tracking-widest">
              ↵ send • shift+↵ newline
            </span>
            <span
              className={`text-[9px] font-mono uppercase tracking-widest ${isRunning ? "text-accent-cyan animate-pulse" : "text-text-disabled"}`}
            >
              {isRunning
                ? "● processing"
                : history.length > 0
                  ? "session_active"
                  : "ready"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentExecutor;
