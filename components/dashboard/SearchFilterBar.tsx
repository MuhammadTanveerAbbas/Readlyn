"use client";

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
  return (
    <div className="sticky top-0 z-10 mb-5 flex gap-2 bg-[#080808]/95 pb-3 pt-2 backdrop-blur">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search projects..."
        className="h-10 flex-1 rounded-md border border-white/[0.07] bg-[#161616] px-3 text-sm text-white placeholder:text-white/40 focus:border-[#F5C518] focus:outline-none"
      />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="h-10 rounded-md border border-white/[0.07] bg-[#161616] px-3 text-sm text-white"
      >
        <option value="updated">Last Edited</option>
        <option value="created">Created</option>
        <option value="name">Name A-Z</option>
      </select>
    </div>
  );
}

