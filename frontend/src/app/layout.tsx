import type { Metadata } from "next";
import { Geist_Mono, Share_Tech_Mono } from "next/font/google";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "AutonomiX — Autonomous AI Agent Platform",
  description:
    "Build, configure and deploy autonomous AI agents with memory, tools and workflows.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${shareTechMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <ReactQueryProvider>
            <div className="flex h-screen overflow-hidden  ">
              <div className="hidden lg:flex">
                <Sidebar />
              </div>

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto overflow-x-hidden bg-bg-primary  terminal-scroll">
                {/* Mobile top bar — only visible below lg */}
                <MobileNav />
                {children}
              </main>
            </div>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
