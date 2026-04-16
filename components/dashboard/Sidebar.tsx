"use client";

import Link from "next/link";
import { Home, Star, Clock3, LayoutTemplate, Trash2, Plus } from "lucide-react";

interface SidebarProps {
  onNewProject: () => void;
}

export default function Sidebar({ onNewProject }: SidebarProps) {
  const nav = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard?view=recent", label: "Recent", icon: Clock3 },
    { href: "/dashboard?view=pinned", label: "Pinned", icon: Star },
    { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
    { href: "/dashboard?view=trash", label: "Trash", icon: Trash2 },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] overflow-y-auto border-r border-white/[0.05] bg-[#0a0a0a] p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold tracking-tight text-white">Readlyn</h1>
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Studio
          </p>
        </div>
        <div className="h-8 w-8 rounded-full border border-white/[0.07] bg-[#161616]" />
      </div>
      <button
        onClick={onNewProject}
        className="mb-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#F5C518] px-3 py-2 text-sm font-semibold text-black shadow-[0_10px_25px_rgba(245,197,24,0.25)] hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" />
        New Project
      </button>
      <nav className="space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm text-white/70 hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-white"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
