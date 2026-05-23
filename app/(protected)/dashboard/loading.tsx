import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <main className="md:ml-[260px] px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="mb-5 rounded-xl border border-white/10 bg-[#0f0f0f] p-4">
          <Skeleton className="h-6 w-32 bg-white/5" />
          <Skeleton className="mt-2 h-4 w-48 bg-white/5" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-[#0f0f0f] p-4"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-lg bg-white/5" />
              <Skeleton className="mt-3 h-4 w-3/4 bg-white/5" />
              <Skeleton className="mt-2 h-3 w-1/2 bg-white/5" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
