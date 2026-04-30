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
  Pin,
  Clock,
  FolderOpen,
  Wand2,
} from "lucide-react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updated");
  const [openModal, setOpenModal] = useState(false);

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

  const pinned = filtered.filter((project) => project.is_pinned);
  const recent = filtered.slice(0, 6);

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

      <main className="md:ml-[260px] p-4 sm:p-6 lg:p-8">
        {/* Hero Banner */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f0f] via-[#0f0f0f] to-[#161616] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 30% 50%, rgba(245,197,24,0.15), transparent 50%)",
            }}
          />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-[#F5C518]" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#F5C518]">
                  AI-Powered Studio
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
                Welcome to Readlyn
              </h1>
              <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
                Create stunning infographics in seconds. Describe your topic,
                choose a layout and theme, and let AI generate a professional
                design you can edit and customize.
              </p>

              {/* Quick stats */}
              <div className="flex items-center gap-4 mt-5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                  <TrendingUp className="h-3.5 w-3.5 text-[#4ADE80]" />
                  <span className="text-xs font-semibold text-white">
                    {projects.length}
                  </span>
                  <span className="text-xs text-white/50">Projects</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                  <Zap className="h-3.5 w-3.5 text-[#F5C518]" />
                  <span className="text-xs font-semibold text-white">
                    {pinned.length}
                  </span>
                  <span className="text-xs text-white/50">Pinned</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5C518]/10 border border-[#F5C518]/30 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5C518] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5C518]" />
                </span>
                <span className="text-xs font-bold text-[#F5C518]">
                  Ready to create
                </span>
              </div>

              <button
                onClick={() => setOpenModal(true)}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#FFDC40] text-black text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(245,197,24,0.3)]"
              >
                <Rocket className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                Create New Project
              </button>
            </div>
          </div>
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
        ) : filtered.length === 0 ? (
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
            {pinned.length > 0 && (
              <ProjectGrid title="Pinned Projects" projects={pinned} />
            )}
            {recent.length > 0 && (
              <ProjectGrid title="Recent Projects" projects={recent} />
            )}
            <ProjectGrid title="All Projects" projects={filtered} />
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
