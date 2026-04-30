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
  Wand2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updated");
  const [openModal, setOpenModal] = useState(false);
  const searchParams = useSearchParams();

  const loadProjects = async () => {
    setLoading(true);
    setError("");
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
      .select("id,title,theme,archetype,updated_at,is_pinned,thumbnail_url")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    if (queryError) {
      setError(queryError.message || "Failed to load projects.");
      setProjects([]);
      setLoading(false);
      return;
    }
    setProjects((data || []) as ProjectItem[]);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = useMemo(() => {
    const base = projects.filter((project) =>
      (project.title || "").toLowerCase().includes(search.toLowerCase()),
    );
    if (sort === "name") {
      return [...base].sort((a, b) =>
        (a.title || "").localeCompare(b.title || ""),
      );
    }
    if (sort === "created") {
      return [...base].sort((a, b) =>
        (a.updated_at || "").localeCompare(b.updated_at || ""),
      );
    }
    return base;
  }, [projects, search, sort]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const view = searchParams?.get("view");
  const pinned = filtered.filter((project) => project.is_pinned);
  const recent = filtered.slice(0, 12);
  const visibleProjects =
    view === "pinned" ? pinned : view === "recent" ? recent : filtered;

  return (
    <div
      className="min-h-screen bg-[#080808]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(245,197,24,0.08), transparent 35%), radial-gradient(circle at 80% 60%, rgba(124,58,237,0.06), transparent 40%)",
      }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        onNewProject={() => setOpenModal(true)} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Mobile header */}
      <div className="md:hidden flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] bg-[#0a0a0a] sticky top-0 z-20">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2 -ml-2 text-white/60 hover:text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <span className="font-bold text-white">Readlyn</span>
      </div>

      <main className="md:ml-[260px] px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0f0f0f] p-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#F5C518]" />
              <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-[#4ADE80]" />
                {projects.length} projects
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-[#F5C518]" />
                {pinned.length} pinned
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="group inline-flex items-center gap-2 rounded-lg bg-[#F5C518] px-4 py-2 text-sm font-bold text-black transition-all hover:bg-[#FFDC40]"
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
        />

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-[#0f0f0f] p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full border-2 border-[#F5C518] border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-white/60">Loading your projects...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-red-200 mb-1">
              Error Loading Projects
            </p>
            <p className="text-xs text-red-300/70">{error}</p>
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f0f] to-[#161616] p-16 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(245,197,24,0.1), transparent 60%)",
              }}
            />

            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#F5C518] to-[#FFDC40] flex items-center justify-center shadow-[0_20px_60px_rgba(245,197,24,0.4)]">
                    <Sparkles className="h-10 w-10 text-black" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#4ADE80] border-2 border-[#0f0f0f] flex items-center justify-center">
                    <Wand2 className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {search ? "No projects found" : "No projects yet"}
              </h3>
              <p className="text-sm text-white/50 max-w-md mx-auto mb-6">
                {search
                  ? `No projects match "${search}". Try a different search term.`
                  : "Start creating your first infographic. Click the button below to begin your journey."}
              </p>

              {!search && (
                <button
                  onClick={() => setOpenModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5C518] hover:bg-[#FFDC40] text-black text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(245,197,24,0.4)]"
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
