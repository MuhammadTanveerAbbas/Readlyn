"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("templates").select("*").limit(20);
      setTemplates(data || []);
    };
    run();
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] p-8">
      <h1 className="mb-6 text-2xl font-semibold text-white">Templates</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="rounded-lg border border-white/[0.07] bg-[#0f0f0f] p-3">
            <div className="mb-3 aspect-[4/3] rounded bg-[#161616]" />
            <p className="text-sm text-white">{tpl.title || "Template"}</p>
            <button className="mt-2 rounded bg-[#F5C518] px-2 py-1 text-xs font-semibold text-black">Use Template</button>
          </div>
        ))}
      </div>
    </div>
  );
}

