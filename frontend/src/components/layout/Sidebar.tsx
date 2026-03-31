"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Plus,
  Bot,
  Wrench,
  Brain,
  Play,
  BarChart2,
  Settings,
  Zap,
} from "lucide-react";

const menuItems = [
  { name: "Create Agent", path: "/agents/create", icon: Plus },
  { name: "My Agents", path: "/agents", icon: Bot },
  { name: "Tools", path: "/tools", icon: Wrench },
  { name: "Memory", path: "/memory", icon: Brain },
  { name: "Runs", path: "/runs", icon: Play },
  { name: "Analytics", path: "/analytics", icon: BarChart2 },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="relative w-60 font-mono h-screen bg-bg-secondary border-r border-border-soft text-text-primary flex flex-col overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Logo */}
      <div className="relative px-5 py-5 border-b border-border-soft">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-accent-cyan/30 bg-accent-cyan/10">
            <Zap size={14} className="text-accent-cyan" />
          </div>
          <span className="text-sm font-bold tracking-widest uppercase text-text-primary group-hover:text-accent-cyan transition-colors">
            AutonomiX
          </span>
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full border border-accent-cyan/20 text-accent-cyan uppercase tracking-widest">
            Beta
          </span>
        </Link>
      </div>

      {/* Nav label */}
      <div className="relative px-5 pt-6 pb-2">
        <span className="text-[9px] text-text-disabled uppercase tracking-[0.25em]">
          Navigation
        </span>
      </div>

      {/* Menu */}
      <nav className="relative flex flex-col gap-0.5 px-3 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md text-xs uppercase tracking-widest transition-all duration-200 group
                ${
                  isActive
                    ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary border border-transparent"
                }`}
            >
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-accent-cyan rounded-full" />
              )}

              <Icon
                size={14}
                className={
                  isActive
                    ? "text-accent-cyan"
                    : "text-text-disabled group-hover:text-text-muted transition-colors"
                }
              />
              {item.name}

              {/* Active dot */}
              {isActive && (
                <span className="ml-auto w-1 h-1 rounded-full bg-accent-cyan animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {session?.user && (
        <div className="flex items-center gap-2 p-3 border-t border-border-soft">
          <img
            src={session.user.image || ""}
            className="w-6 h-6 rounded-full"
            alt="avatar"
          />
          <span className="text-[10px] font-mono text-text-muted truncate">
            {session.user.name}
          </span>
          <button
            onClick={() => signOut()}
            className="ml-auto text-[9px] text-text-disabled hover:text-red-400 transition-colors font-mono uppercase"
          >
            logout
          </button>
        </div>
      )}

      {/* Bottom status */}
      <div className="relative px-5 py-4 border-t border-border-soft">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] text-text-disabled uppercase tracking-[0.2em]">
            System Online
          </span>
        </div>
        <p className="mt-1 text-[9px] text-text-disabled uppercase tracking-widest">
          AutonomiX OS v1.0
        </p>
      </div>
    </div>
  );
}
