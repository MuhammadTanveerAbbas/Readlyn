"use client";

import { Search, SlidersHorizontal, Grid3x3, LayoutGrid } from "lucide-react";
import { useState } from "react";

interface SearchFilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
}

export default function SearchFilterBar({
  search,
  setSearch,
  sort,
  setSort,
}: SearchFilterBarProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="mb-6 pb-2">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="h-11 w-full rounded-lg border border-white/[0.08] bg-[#0f0f0f] pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[#F5C518] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/20 transition-all"
          />
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 appearance-none rounded-lg border border-white/[0.08] bg-[#0f0f0f] pl-10 pr-10 text-sm text-white focus:border-[#F5C518] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/20 transition-all cursor-pointer"
            >
              <option value="updated">Last Edited</option>
              <option value="created">Date Created</option>
              <option value="name">Name A-Z</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="h-4 w-4 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#0f0f0f] p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-[#F5C518] text-black"
                  : "text-white/50 hover:text-white hover:bg-white/[0.05]"
              }`}
              title="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-[#F5C518] text-black"
                  : "text-white/50 hover:text-white hover:bg-white/[0.05]"
              }`}
              title="List view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active filters indicator */}
      {search && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-white/50">Searching for:</span>
          <div className="flex items-center gap-1.5 rounded-md bg-[#F5C518]/10 border border-[#F5C518]/20 px-2 py-1">
            <span className="text-xs font-medium text-[#F5C518]">{search}</span>
            <button
              onClick={() => setSearch("")}
              className="text-[#F5C518] hover:text-[#FFDC40] transition-colors"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
