"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type * as fabric from "fabric";

const MAX_HISTORY = 30;

interface HistorySnapshot {
  stack: string[];
  redo: string[];
}

export function useCanvasHistory(canvas: fabric.Canvas | null) {
  const [history, setHistory] = useState<HistorySnapshot>({
    stack: [],
    redo: [],
  });
  const isRestoring = useRef(false);

  // Seed the history with the initial canvas state once canvas is ready
  useEffect(() => {
    if (!canvas) return;
    // Small delay to let the canvas fully initialize before snapshotting
    const timer = setTimeout(() => {
      if (isRestoring.current) return;
      const json = JSON.stringify(canvas.toJSON());
      setHistory({ stack: [json], redo: [] });
    }, 200);
    return () => clearTimeout(timer);
  }, [canvas]);

  const pushState = useCallback(() => {
    if (!canvas || isRestoring.current) return;
    const json = JSON.stringify(canvas.toJSON());
    setHistory((prev) => {
      // Avoid duplicate consecutive states. Keep the redo trail when the
      // snapshot matches the current top of the stack, so an undo followed
      // by a debounced snapshot does not wipe the redo history.
      if (prev.stack[prev.stack.length - 1] === json) return prev;
      const nextStack = [...prev.stack, json];
      if (nextStack.length > MAX_HISTORY) nextStack.shift();
      return { stack: nextStack, redo: [] };
    });
  }, [canvas]);

  const undo = useCallback(() => {
    if (!canvas || history.stack.length <= 1) return;

    const current = history.stack[history.stack.length - 1];
    const previous = history.stack[history.stack.length - 2];

    isRestoring.current = true;
    setHistory({
      stack: history.stack.slice(0, -1),
      redo: [...history.redo, current],
    });

    canvas.loadFromJSON(previous).then(() => {
      canvas.requestRenderAll();
      isRestoring.current = false;
    });
  }, [canvas, history]);

  const redo = useCallback(() => {
    if (!canvas || history.redo.length === 0) return;

    const next = history.redo[history.redo.length - 1];

    isRestoring.current = true;
    setHistory({
      stack: [...history.stack, next],
      redo: history.redo.slice(0, -1),
    });

    canvas.loadFromJSON(next).then(() => {
      canvas.requestRenderAll();
      isRestoring.current = false;
    });
  }, [canvas, history]);

  const canUndo = history.stack.length > 1;
  const canRedo = history.redo.length > 0;

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    isRestoring,
  };
}
