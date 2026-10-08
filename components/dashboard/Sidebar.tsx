"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Star, Clock3, Layers, Settings, LogOut, User } from "lucide-react";
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
      href: "/tools/parallax",
      label: "Parallax Studio",
      icon: Layers,
      active: pathname === "/tools/parallax",
    },
  ];

  const handleSignOut = async () => {
    setShowUserMenu(false);
    onClose?.();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col
        border-r border-white/[0.06] bg-[var(--surface-base)]
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-5 h-[60px] border-b border-white/[0.06] shrink-0">
        <img
          src="/favicon.svg"
          alt="Readlyn"
          width={18}
          height={18}
          style={{ imageRendering: "pixelated" }}
        />
        <span className="text-[15px] font-bold tracking-tight text-white">
          Readlyn
        </span>

      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
          Workspace
        </p>
        <div className="space-y-0.5">
          {nav.map(({ href, label, icon: Icon, active }) => (
            <Link
              key={href}
              href={href}
              onClick={handleNavClick}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                active
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white/90"
              }`}
            >
              <Icon
                className={`h-[15px] w-[15px] shrink-0 ${
                  active ? "text-[var(--accent)]" : "text-white/40 group-hover:text-white/70"
                }`}
              />
              {label}

            </Link>
          ))}
        </div>
      </nav>

      {/* ── Footer ── */}
      <div className="shrink-0 border-t border-white/[0.06] px-3 py-3">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/50 hover:bg-white/[0.04] hover:text-white/90 transition-colors"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.10] bg-white/[0.04]">
              <User className="h-3.5 w-3.5 text-white/60" />
            </div>
            <span className="flex-1 text-left text-[13px] text-white/60">Account</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/25">
              <path d="M3 5l3-3 3 3M3 7l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 rounded-lg border border-white/[0.08] bg-[var(--surface-raised)] shadow-[0_-8px_32px_rgba(0,0,0,0.4)] z-50 overflow-hidden">
              <div className="p-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onClose?.();
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </button>
                <div className="my-1 h-px bg-white/[0.05]" />
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] text-red-400/80 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
