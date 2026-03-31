"use client";

import { BarChart2, TrendingUp, Users, Activity, CheckCircle, Clock } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    { label: "Total Runs", value: "1,248", change: "+12%", icon: Activity },
    { label: "Active Agents", value: "8", change: "+2", icon: Users },
    { label: "Success Rate", value: "94.2%", change: "+1.4%", icon: CheckCircle },
    { label: "Avg Execution Time", value: "4.2s", change: "-0.5s", icon: Clock },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full font-mono">
      <div className="mb-8 border-b border-border-soft pb-6">
        <h1 className="text-2xl font-bold text-text-primary uppercase tracking-widest flex items-center gap-3">
          <BarChart2 className="text-accent-cyan" />
          System Analytics
        </h1>
        <p className="text-text-muted mt-3 text-sm max-w-3xl leading-relaxed">
          Monitor agent performance, token usage, and execution metrics across all your autonomous workflows.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-bg-secondary border border-border-soft rounded-lg p-6 relative overflow-hidden group hover:border-accent-cyan/50 transition-colors shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="text-text-muted">
                <stat.icon size={20} className="group-hover:text-accent-cyan transition-colors" />
              </div>
              <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'text-green-400 bg-green-400/10 border border-green-400/20' : 'text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs text-text-disabled uppercase tracking-widest font-semibold mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text-primary tracking-wider">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="bg-bg-secondary border border-border-soft rounded-lg p-6 relative overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h3 className="text-sm font-bold text-text-primary tracking-widest uppercase flex items-center gap-2">
            <TrendingUp size={16} className="text-accent-cyan" />
            Execution Volume (30 Days)
          </h3>
          <select className="bg-bg-tertiary border border-border-soft rounded text-xs text-text-muted px-3 py-2 outline-none focus:border-accent-cyan/50 tracking-widest">
            <option>LAST 30 DAYS</option>
            <option>LAST 7 DAYS</option>
            <option>TODAY</option>
          </select>
        </div>
        
        {/* Mock Chart Grid */}
        <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 border-l border-b border-border-soft/50 pl-2 pb-2 pt-4 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] text-text-disabled pb-2 -ml-8 text-right pr-2 font-mono">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          
          {Array.from({ length: 30 }).map((_, i) => {
            const height = Math.floor(Math.random() * 80) + 10;
            return (
              <div key={i} className="w-full flex justify-center group relative h-full items-end pb-0.5">
                <div 
                  className={`w-full max-w-[12px] rounded-t-sm transition-all duration-500 ease-out group-hover:bg-accent-cyan ${i % 3 === 0 ? 'bg-accent-cyan/40' : 'bg-accent-cyan/20'} min-h-[5%]`} 
                  style={{ height: `${height}%` }}
                ></div>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-bg-tertiary border border-border-soft text-[10px] text-text-primary px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap z-10 font-mono tracking-widest pointer-events-none">
                  {height * 12} Runs
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
