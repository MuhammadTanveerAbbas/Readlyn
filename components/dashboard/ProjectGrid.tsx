"use client";

import ProjectCard, { type ProjectItem } from "@/components/dashboard/ProjectCard";

interface ProjectGridProps {
  title: string;
  projects: ProjectItem[];
}

export default function ProjectGrid({ title, projects }: ProjectGridProps) {
  if (projects.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold text-white/90">{title}</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

