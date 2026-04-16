"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type * as fabric from "fabric";

const MAX_HISTORY = 30;

export function useCanvasHistory(canvas: fabric.Canvas | null) {
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const isRestoring = useRef(false);

  // Seed the history with the initial canvas state once canvas is ready
  useEffect(() => {
    if (!canvas) return;
    // Small delay to let the canvas fully initialize before snapshotting
    const timer = setTimeout(() => {
      if (isRestoring.current) return;
      const json = JSON.stringify(canvas.toJSON());
      setHistoryStack([json]);
      setRedoStack([]);
    }, 200);
    return () => clearTimeout(timer);
  }, [canvas]);

  const pushState = useCallback(() => {
    if (!canvas || isRestoring.current) return;
    const json = JSON.stringify(canvas.toJSON());
    setHistoryStack((prev) => {
      // Avoid duplicate consecutive states
      if (prev[prev.length - 1] === json) return prev;
      const next = [...prev, json];
      if (next.length > MAX_HISTORY) next.shift();
      return next;
    });
    setRedoStack([]);
  }, [canvas]);

  const undo = useCallback(() => {
    if (!canvas || historyStack.length <= 1) return;

    isRestoring.current = true;
    const newStack = [...historyStack];
    const current = newStack.pop()!;
    const previous = newStack[newStack.length - 1];

    setHistoryStack(newStack);
    setRedoStack((prev) => [...prev, current]);

    canvas.loadFromJSON(previous).then(() => {
      canvas.renderAll();
      isRestoring.current = false;
    });
  }, [canvas, historyStack]);

  const redo = useCallback(() => {
    if (!canvas || redoStack.length === 0) return;

    isRestoring.current = true;
    const newRedoStack = [...redoStack];
    const state = newRedoStack.pop()!;

    setRedoStack(newRedoStack);
    setHistoryStack((prev) => [...prev, state]);

    canvas.loadFromJSON(state).then(() => {
      canvas.renderAll();
      isRestoring.current = false;
    });
  }, [canvas, redoStack]);

  const canUndo = historyStack.length > 1;
  const canRedo = redoStack.length > 0;

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    isRestoring,
  };
}
