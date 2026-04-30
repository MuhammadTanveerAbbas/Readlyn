"use client";

import Link from "next/link";
import {
  Pin,
  MoreHorizontal,
  Sparkles,
  Calendar,
  ListOrdered,
  BarChart3,
  Clock,
  Scale,
  List,
  Triangle,
  TrendingDown,
  RefreshCw,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface ProjectItem {
  id: string;
  title?: string | null;
  theme?: string | null;
  archetype?: string | null;
  updated_at?: string | null;
  is_pinned?: boolean;
  thumbnail_url?: string | null;
}

interface ProjectCardProps {
  project: ProjectItem;
  onProjectsChanged?: () => Promise<void> | void;
}

const THEME_COLORS: Record<string, string> = {
  violet: "#7c3aed",
  ocean: "#0284c7",
  ember: "#ea580c",
  forest: "#15803d",
  slate: "#475569",
};

const ARCHETYPE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  steps: ListOrdered,
  stats: BarChart3,
  timeline: Clock,
  compare: Scale,
  list: List,
  pyramid: Triangle,
  funnel: TrendingDown,
  cycle: RefreshCw,
  auto: Wand2,
};

export default function ProjectCard({ project, onProjectsChanged }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const title = project.title?.trim() || "Untitled Project";
  const theme = (project.theme || "violet").toLowerCase();
  const archetype = (project.archetype || "auto").toLowerCase();
  const themeColor = THEME_COLORS[theme] || "#7c3aed";
  const ArchetypeIcon = ARCHETYPE_ICONS[archetype] || Wand2;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleRename = async () => {
    setMenuOpen(false);
    const nextTitle = window.prompt("Rename project", title);
    if (!nextTitle || !nextTitle.trim()) return;
    const { error } = await supabase
      .from("projects")
      .update({ title: nextTitle.trim() })
      .eq("id", project.id);
    if (!error) await onProjectsChanged?.();
  };

  const handleDuplicate = async () => {
    setMenuOpen(false);
    const { data: source, error: fetchError } = await supabase
      .from("projects")
      .select("title,theme,archetype,canvas_json,thumbnail_url,user_id")
      .eq("id", project.id)
      .single();
    if (fetchError || !source) return;
    const { error } = await supabase.from("projects").insert({
      ...source,
      title: `${source.title || "Untitled Project"} (Copy)`,
    });
    if (!error) await onProjectsChanged?.();
  };

  const handleTogglePin = async () => {
    setMenuOpen(false);
    const { error } = await supabase
      .from("projects")
      .update({ is_pinned: !project.is_pinned })
      .eq("id", project.id);
    if (!error) await onProjectsChanged?.();
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    setDeleting(false);
    if (!error) {
      setDeleteDialogOpen(false);
      await onProjectsChanged?.();
      router.refresh();
    }
  };

  return (
    <Link
      href={`/editor/${project.id}`}
      className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f0f0f] transition-all duration-300 hover:scale-[1.02] hover:border-white/[0.15] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(245,197,24,0.1)]"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)`,
        }}
      />

      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#161616] via-[#131313] to-[#0f0f0f] overflow-hidden">
        {project.thumbnail_url && !imageError ? (
          <img
            src={project.thumbnail_url}
            alt={title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110"
              style={{
                borderColor: `${themeColor}40`,
                background: `${themeColor}15`,
              }}
            >
              <ArchetypeIcon
                className="h-8 w-8"
                style={{ color: themeColor }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-white/60">
                No preview yet
              </p>
              <p className="text-[10px] text-white/30 mt-1">Click to edit</p>
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top right badges */}
        <div className="absolute right-2 top-2 flex gap-1.5">
          {project.is_pinned && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm border border-[#F5C518]/30">
              <Pin className="h-3.5 w-3.5 text-[#F5C518] fill-[#F5C518]" />
            </div>
          )}
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.preventDefault()}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/80 group-hover:opacity-100"
                aria-label="Project actions"
              >
                <MoreHorizontal className="h-3.5 w-3.5 text-white/70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="z-[100] w-44 border-white/10 bg-[#0f0f0f] text-white"
            >
              <DropdownMenuItem onSelect={handleRename}>
                Rename project
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDuplicate}>
                Duplicate project
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleTogglePin}>
                {project.is_pinned ? "Unpin project" : "Pin project"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setMenuOpen(false);
                  setDeleteDialogOpen(true);
                }}
                className="text-red-400 focus:bg-red-500/10 focus:text-red-300"
              >
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="border-white/10 bg-[#0f0f0f] text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete project?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/60">
                      This action permanently deletes this project and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/5">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleting}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Bottom left theme badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: themeColor }}
          />
          <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider">
            {theme}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="flex-1 truncate text-sm font-semibold tracking-tight text-white group-hover:text-[#F5C518] transition-colors">
            {title}
          </h3>
          <Sparkles className="h-3.5 w-3.5 text-[#F5C518] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <ArchetypeIcon className="h-3.5 w-3.5 text-white/50" />
            <span className="text-[11px] font-medium text-white/50 uppercase tracking-wide">
              {archetype}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-white/30" />
            <span className="text-[10px] text-white/40">
              {formatDate(project.updated_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${themeColor}08, transparent 70%)`,
        }}
      />
    </Link>
  );
}
