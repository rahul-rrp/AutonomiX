"use client";

import { Brain, Search, Trash2, Database, Clock, RefreshCw } from "lucide-react";

export default function MemoryPage() {
  const memories = [
    { id: "1", query: "User prefers concise, bullet-point answers instead of long paragraphs.", agent: "Research Assistant", time: "2 hours ago", vectors: 142 },
    { id: "2", query: "Project timeline for AutonomiX is strictly 3 days for MVP.", agent: "Project Manager", time: "5 hours ago", vectors: 89 },
    { id: "3", query: "The target audience consists of advanced AI builders and developers.", agent: "Marketing Bot", time: "1 day ago", vectors: 231 },
    { id: "4", query: "Budget constraints are set to under $500/month for APIs.", agent: "Financial Analyst", time: "2 days ago", vectors: 56 },
    { id: "5", query: "The client uses Windows OS and prefers VS Code over WebStorm.", agent: "Tech Support", time: "3 days ago", vectors: 104 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full font-mono">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-soft">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-widest flex items-center gap-3">
            <Brain className="text-accent-cyan" />
            Vector Memory Bank
          </h1>
          <p className="text-text-muted mt-3 text-sm max-w-2xl leading-relaxed">
            Agents store contextual knowledge continuously across sessions in the vector database (ChromaDB / Pinecone).
            This long-term memory allows them to learn your preferences and recall past facts autonomously.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-cyan transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Query memory..." 
              className="bg-bg-secondary border border-border-soft rounded-md pl-10 pr-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 w-full md:w-64 tracking-wide transition-all"
            />
          </div>
          <button className="bg-bg-tertiary hover:bg-bg-secondary text-text-muted hover:text-text-primary border border-border-soft hover:border-accent-cyan/30 px-3 py-2.5 rounded-md flex items-center gap-2 text-xs uppercase tracking-widest transition-all">
            <RefreshCw size={14} />
          </button>
          <button className="bg-red-500/5 hover:bg-red-500/15 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-md flex items-center gap-2 text-xs uppercase tracking-widest transition-all">
            <Trash2 size={14} /> Prune All
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-soft rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-soft bg-bg-tertiary text-[10px] text-text-disabled uppercase tracking-[0.2em] font-bold">
          <div className="col-span-12 md:col-span-6">Indexed Knowledge</div>
          <div className="col-span-6 md:col-span-3 hidden md:block">Agent Source</div>
          <div className="col-span-4 md:col-span-2 hidden md:block">Timestamp</div>
          <div className="col-span-2 md:col-span-1 text-right hidden md:block">Vectors</div>
        </div>
        
        <div className="divide-y divide-border-soft/50">
          {memories.map((memory) => (
            <div key={memory.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-bg-tertiary transition-colors group cursor-default">
              <div className="col-span-12 md:col-span-6 text-sm text-text-primary flex items-start gap-3">
                <Database className="text-text-muted mt-0.5 group-hover:text-accent-cyan transition-colors shrink-0" size={16} />
                <span className="leading-relaxed group-hover:text-white transition-colors">"{memory.query}"</span>
              </div>
              <div className="col-span-6 md:col-span-3 text-xs text-text-muted hidden md:flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan/50"></div>
                {memory.agent}
              </div>
              <div className="col-span-4 md:col-span-2 text-xs text-text-muted hidden md:flex items-center gap-2">
                <Clock size={14} /> {memory.time}
              </div>
              <div className="col-span-2 md:col-span-1 text-right text-xs font-mono text-accent-cyan hidden md:block">
                <span className="bg-accent-cyan/10 px-2 py-1 rounded border border-accent-cyan/20">
                  {memory.vectors}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-6 py-4 bg-bg-tertiary border-t border-border-soft flex justify-between items-center">
            <span className="text-xs text-text-muted uppercase tracking-widest">Total Memories: {memories.length}</span>
            <span className="text-[10px] text-text-disabled tracking-widest font-mono">DB: CHROMA-LOCAL</span>
        </div>
      </div>
    </div>
  );
}
