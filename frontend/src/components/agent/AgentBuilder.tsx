"use client";

import React, { useRef, useState } from "react";
import {
  SquareDashedBottomCode,
  HatGlasses,
  Play,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCreateAgent } from "@/hooks/useAgents";

const AgentBuilderText = {
  version: "Agent Builder v1.0",
  placeholder_name: "Give your agent a name...",
  placeholder_goal: "Create a new agent with specific goals...",
};

const ColorButtons = () => (
  <div className="flex gap-2">
    <span className="h-3 w-3 rounded-full bg-red-500" />
    <span className="h-3 w-3 rounded-full bg-yellow-500" />
    <span className="h-3 w-3 rounded-full bg-green-500" />
  </div>
);

const AgentBuilder: React.FC = () => {
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();
  const router = useRouter();

  // ✅ Fixed: onSuccess and onError passed into mutate options
  const { mutate } = useCreateAgent({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] }); // ✅ list will be fresh
      setStatus("success");
      setGoal("");
      setName("");
      setTimeout(() => {
        setStatus("idle");
        router.push("/agents"); // ✅ auto-navigate to see the new agent
      }, 1500);
    },
  });

  const handleGoalInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGoal(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  // ✅ Fixed: React.FormEvent instead of React.SubmitEvent
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!goal.trim() || !name.trim() || status === "loading") return;

    setStatus("loading");

    mutate(
      { agent_name: name, goal },
      {
        onSuccess: () => {
          setStatus("success");
          setGoal("");
          setName("");
          if (textareaRef.current) textareaRef.current.style.height = "auto";
          // Reset back to idle after 3 seconds
          setTimeout(() => setStatus("idle"), 3000);
        },
        onError: () => {
          setStatus("error");
          setTimeout(() => setStatus("idle"), 3000);
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isDisabled = !name.trim() || !goal.trim() || status === "loading";

  return (
    <div className="max-w-3xl mx-auto mt-16 px-6 py-6 rounded-lg border border-border-soft bg-bg-secondary">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <ColorButtons />
          <h2 className="text-sm font-mono text-text-secondary">
            {AgentBuilderText.version}
          </h2>
        </div>

        {/* ✅ Status badge */}
        {status === "success" && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-green-400">
            <CheckCircle size={13} />
            AGENT_DEPLOYED
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-red-400">
            <AlertCircle size={13} />
            DEPLOY_FAILED
          </div>
        )}
        {status === "loading" && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-accent-cyan">
            <Loader2 size={13} className="animate-spin" />
            INITIALIZING...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Agent Name */}
        <div className="relative mb-3">
          <HatGlasses className="absolute left-3 top-4 text-text-secondary" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={AgentBuilderText.placeholder_name}
            disabled={status === "loading"}
            className="w-full pl-12 pr-4 py-4 rounded-md border border-border-strong bg-bg-tertiary text-text-primary placeholder:text-text-secondary outline-none font-mono disabled:opacity-50 focus:border-accent-cyan/50 transition-colors"
          />
        </div>

        {/* Agent Goal */}
        <div className="relative mb-6">
          <SquareDashedBottomCode
            size={22}
            className="absolute left-3 top-4 text-text-secondary"
          />
          <textarea
            ref={textareaRef}
            value={goal}
            onChange={handleGoalInput}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={AgentBuilderText.placeholder_goal}
            disabled={status === "loading"}
            className="w-full pl-12 pr-4 py-4 rounded-md border border-border-strong bg-bg-tertiary text-text-primary placeholder:text-text-secondary resize-none overflow-hidden outline-none font-mono disabled:opacity-50 focus:border-accent-cyan/50 transition-colors"
          />
        </div>

        {/* ✅ Single clear deploy button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isDisabled}
            className="flex items-center gap-2 px-8 py-3 rounded-md bg-accent-cyan text-bg-primary font-mono text-sm font-bold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                Deploy Agent
              </>
            )}
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] font-mono text-text-disabled uppercase tracking-widest">
          Shift + Enter for new line • Enter to deploy
        </p>
      </form>
    </div>
  );
};

export default AgentBuilder;
