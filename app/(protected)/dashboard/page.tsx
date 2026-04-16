"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import SearchFilterBar from "@/components/dashboard/SearchFilterBar";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import { createClient } from "@/lib/supabase/client";
import type { ProjectItem } from "@/components/dashboard/ProjectCard";

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

  const pinned = filtered.filter((project) => project.is_pinned);
  const recent = filtered.slice(0, 6);

  return (
    <div
      className="min-h-screen bg-[#080808]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(245,197,24,0.06), transparent 30%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.03), transparent 26%)",
      }}
    >
      <Sidebar onNewProject={() => setOpenModal(true)} />
      <main className="ml-[240px] min-h-screen p-6">
        <div className="mb-6 rounded-xl border border-white/10 bg-gradient-to-r from-[#0f0f0f] to-[#161616] p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-semibold text-white tracking-[-0.01em]">
                Welcome to Readlyn
              </h1>
              <p className="mt-2 text-sm text-white/70 max-w-2xl">
                Create stunning infographics in seconds. Describe your topic,
                choose a layout and theme, and let AI generate a professional
                design you can edit and customize.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5C518]/10 border border-[#F5C518]/30">
              <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse" />
              <span className="text-xs font-medium text-[#F5C518]">
                Ready to create
              </span>
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
          <div className="rounded-xl border border-white/10 bg-[#0f0f0f] p-6 text-sm text-white/70">
            Loading projects...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#0f0f0f] p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#F5C518]/10 border border-[#F5C518]/30 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
            <p className="text-base font-semibold text-white">
              No projects yet
            </p>
            <p className="mt-2 text-sm text-white/60 max-w-sm mx-auto">
              Start creating your first infographic. Click "New Project" to
              begin.
            </p>
            <button
              onClick={() => setOpenModal(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-[#F5C518] hover:bg-[#FFDC40] text-black text-sm font-semibold transition-all"
            >
              Create First Project
            </button>
          </div>
        ) : (
          <>
            <ProjectGrid title="Pinned Projects" projects={pinned} />
            <ProjectGrid title="Recent Projects" projects={recent} />
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
