"use client";

import { useEffect, useState } from "react";

const HeaderData = {
  title: "AutonomiX",
  subtitle:
    "Build, configure and deploy autonomous AI agents with memory, tools and workflows.",
  announcement: "🚀 Now supports multi-agent orchestration",
};

const useTypewriter = (text: string, speed = 18) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
};

const HeroHeader = () => {
  const { displayed, done } = useTypewriter(HeaderData.subtitle, 18);

  return (
    <section className="relative w-full py-16 px-6 text-center overflow-hidden">
      {/* Inline keyframe styles — no useState needed */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim { 
          opacity: 0; 
          animation: fadeUp 0.6s ease forwards; 
        }
        .anim-1 { animation-delay: 0ms; }
        .anim-2 { animation-delay: 100ms; }
        .anim-3 { animation-delay: 200ms; }
        .anim-4 { animation-delay: 350ms; }
        .anim-5 { animation-delay: 500ms; }
        .anim-6 { animation-delay: 650ms; }
      `}</style>

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,255,255,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Status bar */}
      <div className="anim anim-1 flex items-center justify-center gap-2 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">
          System Online — All agents operational
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
      </div>

      {/* Title */}
      <div className="anim anim-2">
        <h1 className="relative inline-block text-6xl md:text-7xl font-bold font-display tracking-tight text-text-primary">
          <span
            className="absolute inset-0 text-accent-cyan opacity-20 blur-[2px] select-none pointer-events-none"
            aria-hidden
          >
            {HeaderData.title}
          </span>
          <span
            className="absolute inset-0 text-accent-blue opacity-10 blur-[4px] select-none pointer-events-none"
            aria-hidden
          >
            {HeaderData.title}
          </span>

          {HeaderData.title}

          <span className="ml-3 align-middle text-[11px] px-2.5 py-1 font-mono rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan">
            Beta
          </span>
        </h1>
      </div>

      {/* Subtitle typewriter */}
      <div className="anim anim-3 mt-6">
        <p className="text-base md:text-lg text-text-secondary font-mono max-w-2xl mx-auto min-h-[2rem]">
          <span className="text-accent-cyan/60 mr-1"></span>
          {displayed}
          {!done && (
            <span className="inline-block w-[2px] h-[1em] bg-accent-cyan ml-0.5 align-middle animate-pulse" />
          )}
        </p>
      </div>

      {/* Announcement pill */}
      {/* <div className="anim anim-4 mt-8">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent-blue/30 bg-accent-blue/5 hover:bg-accent-blue/10 hover:border-accent-blue/50 transition-all duration-300 cursor-default">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
          <span className="font-mono text-sm text-accent-blue">
            {HeaderData.announcement}
          </span>
        </div>
      </div> */}

      {/* Stats row */}
      <div className="anim anim-5 mt-12 flex items-center justify-center gap-8 md:gap-16">
        {[
          { value: "04", label: "Built-in Tools" },
          { value: "AI", label: "Powered By Gemini" },
          { value: "RAG", label: "Memory Engine" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-bold font-mono text-text-primary">
              {stat.value}
            </div>
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom divider */}
      <div className="anim anim-6 mt-12 flex items-center gap-4 max-w-xl mx-auto">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border-soft" />
        <span className="font-mono text-[9px] text-text-disabled uppercase tracking-[0.3em]">
          Autonomix OS v1.0
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border-soft" />
      </div>
    </section>
  );
};

export default HeroHeader;
