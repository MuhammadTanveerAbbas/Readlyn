"use client";

import ProjectCard, {
  type ProjectItem,
} from "@/components/dashboard/ProjectCard";
import { Pin, Clock, FolderOpen } from "lucide-react";

interface ProjectGridProps {
  title: string;
  projects: ProjectItem[];
  onProjectsChanged?: () => Promise<void> | void;
}

const SECTION_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "Pinned Projects": Pin,
  "Recent Projects": Clock,
  "All Projects": FolderOpen,
};

export default function ProjectGrid({
  title,
  projects,
  onProjectsChanged,
}: ProjectGridProps) {
  if (projects.length === 0) return null;

  const IconComponent = SECTION_ICONS[title];
  const iconColors: Record<string, string> = {
    "Pinned Projects": "text-[#F5C518]",
    "Recent Projects": "text-[#4ADE80]",
    "All Projects": "text-[#60A5FA]",
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        {IconComponent && (
          <IconComponent
            className={`h-4 w-4 ${iconColors[title] || "text-white/50"}`}
          />
        )}
        <h2 className="text-base font-bold text-white tracking-tight">
          {title}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        <span className="text-xs font-medium text-white/40">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onProjectsChanged={onProjectsChanged}
          />
        ))}
      </div>
    </section>
  );
}
