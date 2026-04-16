"use client";

import Link from "next/link";
import { Pin, MoreHorizontal } from "lucide-react";

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
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const title = project.title?.trim() || "Untitled Project";
  const subtitle = `${(project.archetype || "AUTO").toUpperCase()} · ${(project.theme || "VIOLET").toUpperCase()}`;
  return (
    <Link
      href={`/editor/${project.id}`}
      className="group overflow-hidden rounded-lg border border-white/[0.07] bg-[#0f0f0f] transition-all duration-200 hover:scale-[1.02] hover:border-white/[0.12] hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
    >
      <div className="h-1 w-full bg-transparent group-hover:bg-[#F5C518]" />
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#161616] via-[#131313] to-[#0f0f0f]">
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/45">
            No preview yet
          </div>
        )}
        <div className="absolute right-2 top-2 flex gap-1">
          {project.is_pinned ? <Pin className="h-4 w-4 text-[#F5C518]" /> : null}
          <MoreHorizontal className="h-4 w-4 text-white/70" />
        </div>
      </div>
      <div className="space-y-1 p-3">
        <p className="truncate text-sm font-semibold tracking-tight text-white">{title}</p>
        <p className="text-xs font-mono uppercase text-white/50">{subtitle}</p>
      </div>
    </Link>
  );
}

