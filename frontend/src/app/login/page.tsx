"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-bg-primary font-mono">
      <div className="border border-border-soft rounded-xl p-10 bg-bg-secondary space-y-6 text-center">
        {/* Logo */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-accent-cyan tracking-tight">
            AUTONOMIX
          </h1>
          <p className="text-text-disabled text-xs uppercase tracking-widest">
            Autonomous AI Agent Platform
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border-soft" />

        {/* Login button */}
        <div className="space-y-3">
          <p className="text-text-muted text-xs uppercase tracking-widest">
            Sign in to continue
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex items-center gap-3 px-6 py-3 rounded-lg border border-border-soft bg-bg-primary hover:border-accent-cyan/40 transition-all duration-200 text-text-primary font-mono text-sm w-full justify-center"
          >
            <img
              src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
              className="w-4 h-4"
              alt="Google"
            />
            Continue with Google
          </button>
        </div>

        <p className="text-text-disabled text-[10px]">
          By signing in you agree to our terms of service
        </p>
      </div>
    </div>
  );
}
