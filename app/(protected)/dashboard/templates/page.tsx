"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("templates").select("id,title,thumbnail_url").limit(20);
      setTemplates(data || []);
      setLoading(false);
    };
    run();
  }, []);

  return (
    <div className="min-h-screen bg-[#080808]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar 
        onNewProject={() => {}} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="md:hidden flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] bg-[#0a0a0a] sticky top-0 z-20">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2 -ml-2 text-white/60 hover:text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <span className="font-bold text-white">Templates</span>
      </div>
      <main className="md:ml-[260px] p-4 sm:p-6 lg:p-8">
        <h1 className="mb-6 text-xl sm:text-2xl font-semibold text-white">Templates</h1>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {templates.map((tpl) => (
              <div key={tpl.id} className="rounded-lg border border-white/[0.07] bg-[#0f0f0f] p-3">
                <div className="mb-3 aspect-[4/3] rounded bg-[#161616]" />
                <p className="text-sm text-white">{tpl.title || "Template"}</p>
                <button className="mt-2 rounded bg-[#F5C518] px-2 py-1 text-xs font-semibold text-black">Use Template</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

