"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Home,
  Star,
  Clock3,
  LayoutTemplate,
  Trash2,
  Plus,
  Settings,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  onNewProject: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ onNewProject, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const view = searchParams?.get("view");

  const nav = [
    {
      href: "/dashboard",
      label: "Home",
      icon: Home,
      active: pathname === "/dashboard" && !view,
    },
    {
      href: "/dashboard?view=recent",
      label: "Recent",
      icon: Clock3,
      active: view === "recent",
    },
    {
      href: "/dashboard?view=pinned",
      label: "Pinned",
      icon: Star,
      active: view === "pinned",
    },
    {
      href: "/dashboard/templates",
      label: "Templates",
      icon: LayoutTemplate,
      active: pathname === "/dashboard/templates",
    },
    {
      href: "/dashboard?view=trash",
      label: "Trash",
      icon: Trash2,
      active: view === "trash",
    },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className={`
      fixed md:sticky left-0 top-0 z-40 h-screen w-[260px] overflow-y-auto border-r border-white/[0.06] bg-[#0a0a0a] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
      transform transition-transform duration-200 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Header */}
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                Readlyn
              </h1>
              <div className="flex h-5 items-center gap-1 rounded-md bg-[#F5C518]/10 border border-[#F5C518]/20 px-1.5">
                <Sparkles className="h-2.5 w-2.5 text-[#F5C518]" />
                <span className="text-[9px] font-bold text-[#F5C518] uppercase tracking-wider">
                  AI
                </span>
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mt-0.5">
              Studio
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#161616] to-[#0f0f0f] hover:border-white/[0.15] transition-all hover:scale-105"
            >
              <User className="h-4 w-4 text-white/70" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-11 w-48 rounded-lg border border-white/[0.08] bg-[#0f0f0f] shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50">
                <div className="p-1">
                  <button
                    onClick={() => router.push("/settings")}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onNewProject}
          className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-4 py-2.5 text-sm font-bold text-black shadow-[0_10px_30px_rgba(245,197,24,0.3)] transition-all hover:bg-[#FFDC40] hover:shadow-[0_15px_40px_rgba(245,197,24,0.4)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New Project
          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3">
        <div className="mb-2 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
            Workspace
          </p>
        </div>
        <div className="space-y-0.5">
          {nav.map(({ href, label, icon: Icon, active }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/20"
                  : "text-white/60 hover:bg-white/[0.04] hover:text-white border border-transparent hover:border-white/[0.08]"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-transform group-hover:scale-110 ${active ? "text-[#F5C518]" : ""}`}
              />
              {label}
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] bg-[#0a0a0a] p-4">
        <div className="rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#F5C518]/5 to-transparent p-3">
          <div className="flex items-start gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5C518]/20">
              <Sparkles className="h-4 w-4 text-[#F5C518]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">AI-Powered</p>
              <p className="text-[10px] text-white/50 mt-0.5">
                Generate infographics instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
