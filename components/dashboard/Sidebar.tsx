"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Home,
  Star,
  Clock3,
  Settings,
  LogOut,
  User,
  ChevronDown,
  FolderOpen,
  LayoutGrid,
  Info,
  FileText,
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
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const view = searchParams?.get("view");

  const workspaceNav = [
    {
      href: "/dashboard",
      label: "All Projects",
      icon: LayoutGrid,
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
  ];

  const resourcesNav = [
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
    {
      href: "/privacy",
      label: "Privacy Policy",
      icon: FileText,
      active: pathname === "/privacy",
    },
    {
      href: "/terms",
      label: "Terms of Service",
      icon: Info,
      active: pathname === "/terms",
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

  const NavItem = ({
    href,
    label,
    icon: Icon,
    active,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    active: boolean;
  }) => (
    <Link
      href={href}
      onClick={handleNavClick}
      className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
        active
          ? "bg-[var(--accent)]/10 text-[var(--accent-text)]"
          : "text-[var(--text-muted)] hover:bg-[var(--fill-default)] hover:text-[var(--text-primary)]/90"
      }`}
    >
      <Icon
        className={`h-[14px] w-[14px] shrink-0 ${
          active
            ? "text-[var(--accent-text)]"
            : "text-[var(--text-faint)] group-hover:text-[var(--text-body)]"
        }`}
      />
      {label}
    </Link>
  );

  const SectionHeader = ({
    label,
    open,
    toggle,
  }: {
    label: string;
    open: boolean;
    toggle: () => void;
  }) => (
    <button
      onClick={toggle}
      className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
    >
      <span>{label}</span>
      <ChevronDown
        className={`w-3 h-3 transition-transform duration-150 ${open ? "" : "-rotate-90"}`}
      />
    </button>
  );

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col
        border-r border-[var(--line-subtle)] bg-[var(--surface-base)]
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-[60px] border-b border-[var(--line-subtle)] shrink-0">
        <img
          src="/favicon.svg"
          alt="Readlyn"
          width={18}
          height={18}
          style={{ imageRendering: "pixelated" }}
        />
        <span className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">
          Readlyn
        </span>
      </div>

      {/* New Project button */}
      <div className="px-3 py-3 border-b border-[var(--line-subtle)] shrink-0">
        <button
          onClick={() => {
            onNewProject();
            onClose?.();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-[13px] font-bold text-[var(--accent-ink)] transition-all hover:bg-[var(--accent-hover)] active:scale-[0.98]"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          New Project
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Workspace section */}
        <div>
          <SectionHeader
            label="Workspace"
            open={workspaceOpen}
            toggle={() => setWorkspaceOpen((v) => !v)}
          />
          {workspaceOpen && (
            <div className="mt-1 space-y-0.5">
              {workspaceNav.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          )}
        </div>

        {/* Resources section */}
        <div>
          <SectionHeader
            label="Resources"
            open={resourcesOpen}
            toggle={() => setResourcesOpen((v) => !v)}
          />
          {resourcesOpen && (
            <div className="mt-1 space-y-0.5">
              {resourcesNav.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer account menu */}
      <div className="shrink-0 border-t border-[var(--line-subtle)] px-3 py-3">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[var(--text-muted)] hover:bg-[var(--fill-default)] hover:text-[var(--text-primary)]/90 transition-colors"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--line-default)] bg-[var(--fill-default)]">
              <User className="h-3.5 w-3.5 text-[var(--text-body)]" />
            </div>
            <span className="flex-1 text-left text-[13px] text-[var(--text-body)]">Account</span>
            <ChevronDown
              className={`w-3 h-3 text-[var(--text-faint)] transition-transform duration-150 ${showUserMenu ? "rotate-180" : ""}`}
            />
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 rounded-lg border border-[var(--line-default)] bg-[var(--surface-raised)] shadow-[var(--elevation-floating)] z-50 overflow-hidden">
              <div className="p-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onClose?.();
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] text-[var(--text-body)] hover:bg-[var(--fill-default)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </button>
                <div className="my-1 h-px bg-[var(--fill-default)]" />
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors"
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
