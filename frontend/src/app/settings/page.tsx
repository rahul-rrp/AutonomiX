"use client";

import { Settings, Key, User, Shield, HardDrive, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full font-mono pb-20">
      <div className="mb-8 border-b border-border-soft pb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-widest flex items-center gap-3">
            <Settings className="text-accent-cyan" />
            System Configuration
          </h1>
          <p className="text-text-muted mt-3 text-sm leading-relaxed">
            Manage your API keys, platform preferences, and user account details.
          </p>
        </div>
        
        <button className="bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 px-5 py-2.5 rounded-md flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(0,255,255,0.05)] hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] w-full sm:w-auto">
          <Save size={14} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Settings Navigation */}
        <div className="md:col-span-3 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          <button className="flex items-center gap-3 px-4 py-3 bg-accent-cyan/10 text-accent-cyan border-b-2 md:border-b-0 md:border-l-2 border-accent-cyan min-w-max md:min-w-0 text-sm tracking-wide font-bold text-left">
            <Key size={16} /> API Keys
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-r text-sm min-w-max md:min-w-0 tracking-wide text-left transition-colors">
            <User size={16} /> Account
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-r text-sm min-w-max md:min-w-0 tracking-wide text-left transition-colors">
            <HardDrive size={16} /> Storage
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-r text-sm min-w-max md:min-w-0 tracking-wide text-left transition-colors">
            <Shield size={16} /> Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-9 space-y-6">
          <div className="bg-bg-secondary border border-border-soft rounded-lg overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-border-soft bg-bg-tertiary">
              <h3 className="text-sm font-bold text-text-primary tracking-widest uppercase">LLM Provider Configuration</h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-text-muted tracking-widest uppercase mb-2">Google Gemini API Key</label>
                <input 
                  type="password" 
                  defaultValue="••••••••••••••••••••••••••••••••"
                  className="w-full bg-bg-tertiary border border-border-soft rounded-md px-4 py-3 text-sm text-text-primary outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 tracking-widest font-mono transition-all"
                />
                <p className="text-[10px] text-text-disabled mt-2 tracking-wide">Required for the core agent reasoning engine (using Gemini 2.5 Flash).</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted tracking-widest uppercase mb-2">OpenAI API Key (Optional)</label>
                <input 
                  type="password" 
                  placeholder="sk-..."
                  className="w-full bg-bg-tertiary border border-border-soft rounded-md px-4 py-3 text-sm text-text-primary outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 tracking-widest font-mono transition-all"
                />
                <p className="text-[10px] text-text-disabled mt-2 tracking-wide">Fallback provider for specific demanding agent personas.</p>
              </div>

            </div>
          </div>

          <div className="bg-bg-secondary border border-border-soft rounded-lg overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-border-soft bg-bg-tertiary">
              <h3 className="text-sm font-bold text-text-primary tracking-widest uppercase">Memory & Database</h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-text-muted tracking-widest uppercase mb-2">Chroma DB Host URL</label>
                <input 
                  type="text" 
                  defaultValue="http://localhost:8000"
                  className="w-full bg-bg-tertiary border border-border-soft rounded-md px-4 py-3 text-sm text-text-primary outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 tracking-widest font-mono transition-all"
                />
                <p className="text-[10px] text-text-disabled mt-2 tracking-wide">Connects your agents to vector storage for long-term memory retrieval.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
