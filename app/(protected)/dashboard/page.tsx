"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import SearchFilterBar from "@/components/dashboard/SearchFilterBar";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import { createClient } from "@/lib/supabase/client";
import type { ProjectItem } from "@/components/dashboard/ProjectCard";
import {
  Sparkles,
  TrendingUp,
  Zap,
  Rocket,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updated");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [openModal, setOpenModal] = useState(false);
  const searchParams = useSearchParams();

  const loadProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setProjects([]);
        setLoading(false);
        setError("Not authenticated.");
        return;
      }
      const { data, error: queryError } = await supabase
        .from("projects")
        .select("id,title,theme,archetype,created_at,updated_at,is_pinned,thumbnail_url,is_trashed")
        .eq("user_id", user.id)
        .eq("is_trashed", false)
        .order("updated_at", { ascending: false });

      if (queryError) {
        setError(queryError.message || "Failed to load projects.");
        setProjects([]);
        setLoading(false);
        return;
      }
      setProjects((data || []) as ProjectItem[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const base = projects.filter((project) =>
      (project.title || "").toLowerCase().includes(query),
    );

    if (sort === "name") {
      return [...base].sort((a, b) =>
        (a.title || "").localeCompare(b.title || ""),
      );
    }
    if (sort === "created") {
      return [...base].sort((a, b) => {
        const timeA = new Date(a.created_at || a.updated_at || 0).getTime();
        const timeB = new Date(b.created_at || b.updated_at || 0).getTime();
        return timeB - timeA;
      });
    }
    // Default: "updated"
    return [...base].sort((a, b) => {
      const timeA = new Date(a.updated_at || 0).getTime();
      const timeB = new Date(b.updated_at || 0).getTime();
      return timeB - timeA;
    });
  }, [projects, search, sort]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const view = searchParams?.get("view");
  const pinned = filtered.filter((project) => project.is_pinned);
  const recent = filtered.slice(0, 12);
  const visibleProjects =
    view === "pinned" ? pinned : view === "recent" ? recent : filtered;

  return (
    <div
      className="min-h-screen bg-[var(--surface-sunken)]"
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-[var(--scrim)] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        onNewProject={() => setOpenModal(true)} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Mobile header */}
      <div className="md:hidden flex items-center gap-3 px-4 h-16 border-b border-[var(--line-subtle)] bg-[var(--surface-base)] sticky top-0 z-20">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2.5 -ml-2 min-h-11 min-w-11 text-[var(--text-body)] hover:text-[var(--text-primary)]"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <span className="font-bold text-[var(--text-primary)]">Readlyn</span>
      </div>

      <main className="md:ml-[240px] px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--line-default)] bg-[var(--surface-base)] p-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--accent-text)]" />
              <h1 className="text-lg font-semibold text-[var(--text-primary)]">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-[var(--success)]" />
                {projects.length} projects
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-[var(--accent-text)]" />
                {pinned.length} pinned
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="group inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--accent-ink)] transition-all hover:bg-[var(--accent-hover)]"
          >
            <Rocket className="h-4 w-4" />
            Create New Project
          </button>
        </div>

        <SearchFilterBar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {loading ? (
          <div className="rounded-xl border border-[var(--line-default)] bg-[var(--surface-base)] p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-[var(--text-body)]">Loading your projects...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-[var(--danger)]/40 bg-[var(--danger-soft)] p-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-[var(--danger)]/15 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 7v5M12 15v1" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-semibold text-[var(--danger)] mb-1">
              Error Loading Projects
            </p>
            <p className="text-xs text-[var(--danger)]/80 mb-4">{error}</p>
            <button
              onClick={loadProjects}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/40 px-4 py-2 text-sm text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" />
              </svg>
              Retry
            </button>
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="rounded-2xl border border-[var(--line-default)] bg-[var(--surface-base)] p-8 sm:p-16 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-2xl bg-[var(--accent)] flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-[var(--accent-ink)]" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {search ? "No projects found" : "No projects yet"}
              </h3>
              <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-6">
                {search
                  ? `No projects match "${search}". Try a different search term.`
                  : "Start creating your first infographic. Click the button below to begin your journey."}
              </p>

              {!search && (
                <button
                  onClick={() => setOpenModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] text-sm font-bold transition-all hover:scale-105 active:scale-95"
                >
                  <Sparkles className="h-4 w-4" />
                  Create Your First Project
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <ProjectGrid
              title={
                view === "pinned"
                  ? "Pinned Projects"
                  : view === "recent"
                    ? "Recent Projects"
                    : "All Projects"
              }
              projects={visibleProjects}
              viewMode={viewMode}
              onProjectsChanged={loadProjects}
            />
          </>
        )}
      </main>
      <NewProjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={loadProjects}
      />
    </div>
  );
}
