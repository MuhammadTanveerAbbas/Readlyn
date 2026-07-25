"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { createClient } from "@/lib/supabase/client";

export function useOfflineBuffer(
  canvas: fabric.Canvas | null,
  projectId: string | undefined
) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const bufferKey = `readlyn_offline_buffer_${projectId}`;
  const lastSavedJson = useRef<string | null>(null);

  // Monitor offline/online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncBufferedChanges();
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [projectId]);

  // Buffer canvas changes locally on change
  useEffect(() => {
    if (!canvas || !projectId) return;

    const bufferState = () => {
      try {
        const json = JSON.stringify(canvas.toJSON());
        if (json !== lastSavedJson.current) {
          localStorage.setItem(bufferKey, json);
        }
      } catch (err) {
        console.warn("Failed to write to local offline buffer", err);
      }
    };

    canvas.on("object:modified", bufferState);
    canvas.on("object:added", bufferState);
    canvas.on("object:removed", bufferState);

    return () => {
      canvas.off("object:modified", bufferState);
      canvas.off("object:added", bufferState);
      canvas.off("object:removed", bufferState);
    };
  }, [canvas, projectId, bufferKey]);

  // Sync buffered changes to remote database
  const syncBufferedChanges = async () => {
    if (!projectId || !navigator.onLine) return;

    const buffered = localStorage.getItem(bufferKey);
    if (!buffered) return;

    setIsSyncing(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const parsed = JSON.parse(buffered);
      await supabase
        .from("projects")
        .update({
          canvas_json: parsed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .eq("user_id", user.id);

      lastSavedJson.current = buffered;
      localStorage.removeItem(bufferKey);
    } catch (err) {
      console.error("Offline buffer sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return { isOffline, isSyncing, syncBufferedChanges };
}
