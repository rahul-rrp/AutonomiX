"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Zap,
  Plus,
  Bot,
  Wrench,
  Brain,
  Play,
  BarChart2,
  Settings,
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

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    // ✅ Only renders on mobile
    <div className="lg:hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-soft bg-bg-secondary">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-accent-cyan/30 bg-accent-cyan/10">
            <Zap size={12} className="text-accent-cyan" />
          </div>
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-text-primary">
            AutonomiX
          </span>
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md border border-border-soft text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-all"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute top-[49px] left-0 right-0 z-50 bg-bg-secondary border-b border-border-soft shadow-xl">
          <nav className="flex flex-col gap-0.5 p-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setOpen(false)} // ✅ close on nav
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-mono text-xs uppercase tracking-widest transition-all
                    ${
                      isActive
                        ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20"
                        : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary border border-transparent"
                    }`}
                >
                  <Icon size={14} />
                  {item.name}
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
        </div>
      )}
    </div>
  );
}
