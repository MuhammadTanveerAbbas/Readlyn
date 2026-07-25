"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, EyeOff, Lock, LockOpen, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type * as fabric from "fabric";

interface LayerItem {
  id: string;
  type: string;
  label: string;
  visible: boolean;
  locked: boolean;
  object: fabric.FabricObject;
}

interface LayersPanelProps {
  canvas: fabric.Canvas | null;
  onSelectObject: (obj: fabric.FabricObject) => void;
  refreshTrigger?: number;
}

const TYPE_BADGE: Record<string, { color: string; abbr: string }> = {
  text: { color: "#60a5fa", abbr: "T" },
  rect: { color: "#34d399", abbr: "R" },
  circle: { color: "#f97316", abbr: "C" },
  line: { color: "#94a3b8", abbr: "L" },
  group: { color: "#f5c518", abbr: "G" },
  stat: { color: "#f97316", abbr: "S" },
  icon: { color: "#60a5fa", abbr: "I" },
  "i-text": { color: "#60a5fa", abbr: "T" },
};

function getObjectType(obj: fabric.FabricObject): string {
  if (obj.type === "i-text" || obj.type === "text") return "text";
  if (obj.type === "rect") return "rect";
  if (obj.type === "circle") return "circle";
  if (obj.type === "line") return "line";
  if (obj.type === "group") return "group";
  return obj.type || "shape";
}

export default function LayersPanel({
  canvas,
  onSelectObject,
  refreshTrigger,
}: LayersPanelProps) {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const refreshLayers = useCallback(() => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const items: LayerItem[] = objects
      .map((obj, index) => {
        const o = obj as fabric.FabricObject & {
          _elementType?: string;
          _elementId?: string;
        };
        const type = o._elementType || getObjectType(obj);
        return {
          id: o._elementId || `obj-${index}`,
          type,
          label: getLabelFromObject(obj, type, index),
          visible: obj.visible !== false,
          locked: obj.selectable === false,
          object: obj,
        };
      })
      .reverse();
    setLayers(items);
  }, [canvas]);

  useEffect(() => {
    refreshLayers();
  }, [refreshLayers, refreshTrigger]);

  useEffect(() => {
    if (!canvas) return;
    const handler = () => refreshLayers();
    canvas.on("object:added", handler);
    canvas.on("object:removed", handler);
    canvas.on("selection:created", () => {
      const active = canvas.getActiveObject();
      if (active) {
        const o = active as fabric.FabricObject & { _elementId?: string };
        setSelected(o._elementId || null);
      }
    });
    canvas.on("selection:cleared", () => setSelected(null));
    return () => {
      canvas.off("object:added", handler);
      canvas.off("object:removed", handler);
    };
  }, [canvas, refreshLayers]);

  const toggleVisibility = (layer: LayerItem, e: React.MouseEvent) => {
    e.stopPropagation();
    layer.object.set("visible", !layer.visible);
    canvas?.renderAll();
    refreshLayers();
  };

  const toggleLock = (layer: LayerItem, e: React.MouseEvent) => {
    e.stopPropagation();
    layer.object.set("selectable", layer.locked);
    layer.object.set("evented", layer.locked);
    canvas?.renderAll();
    refreshLayers();
  };

  const deleteLayer = (layer: LayerItem, e: React.MouseEvent) => {
    e.stopPropagation();
    canvas?.remove(layer.object);
    canvas?.renderAll();
    refreshLayers();
  };

  const moveLayerUp = (layer: LayerItem, e: React.MouseEvent) => {
    e.stopPropagation();
    canvas?.bringObjectForward(layer.object);
    canvas?.renderAll();
    refreshLayers();
  };

  const moveLayerDown = (layer: LayerItem, e: React.MouseEvent) => {
    e.stopPropagation();
    canvas?.sendObjectBackwards(layer.object);
    canvas?.renderAll();
    refreshLayers();
  };

  const selectLayer = (layer: LayerItem) => {
    if (!canvas || layer.locked) return;
    canvas.setActiveObject(layer.object);
    canvas.renderAll();
    setSelected(layer.id);
    onSelectObject(layer.object);
  };

  return (
    <div className="flex flex-col min-h-0 border-t border-white/[0.06]">
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
          Layers
        </span>
        <span className="text-[10px] text-white/30 tabular-nums">{layers.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto pb-2 scrollbar-hide">
        {layers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-3 gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6M9 12h6M9 15h4" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[10px] text-white/25 text-center">
              No layers yet.<br />Generate or add elements.
            </p>
          </div>
        ) : (
          <div className="px-1.5 space-y-px">
            {layers.map((layer) => {
              const badge = TYPE_BADGE[layer.type] ?? { color: "#94a3b8", abbr: "?" };
              const isSelected = selected === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => selectLayer(layer)}
                  className={`group flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] cursor-pointer transition-all duration-100 ${
                    isSelected
                      ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30"
                      : "border border-transparent hover:bg-white/[0.04] hover:border-white/[0.06]"
                  } ${layer.locked ? "opacity-50" : ""} ${!layer.visible ? "opacity-30" : ""}`}
                >
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                    style={{ backgroundColor: badge.color + "22", border: `1px solid ${badge.color}44` }}
                  >
                    <span style={{ color: badge.color }}>{badge.abbr}</span>
                  </div>

                  <span className={`flex-1 truncate text-[11px] ${isSelected ? "text-white" : "text-white/60"}`}>
                    {layer.label}
                  </span>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => moveLayerUp(layer, e)}
                      className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10"
                      title="Move up"
                    >
                      <ChevronUp className="w-2.5 h-2.5 text-white/50" />
                    </button>
                    <button
                      onClick={(e) => moveLayerDown(layer, e)}
                      className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10"
                      title="Move down"
                    >
                      <ChevronDown className="w-2.5 h-2.5 text-white/50" />
                    </button>
                    <button
                      onClick={(e) => toggleVisibility(layer, e)}
                      className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10"
                      title={layer.visible ? "Hide" : "Show"}
                    >
                      {layer.visible ? (
                        <Eye className="w-2.5 h-2.5 text-white/50" />
                      ) : (
                        <EyeOff className="w-2.5 h-2.5 text-white/30" />
                      )}
                    </button>
                    <button
                      onClick={(e) => toggleLock(layer, e)}
                      className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10"
                      title={layer.locked ? "Unlock" : "Lock"}
                    >
                      {layer.locked ? (
                        <Lock className="w-2.5 h-2.5 text-white/50" />
                      ) : (
                        <LockOpen className="w-2.5 h-2.5 text-white/30" />
                      )}
                    </button>
                    <button
                      onClick={(e) => deleteLayer(layer, e)}
                      className="w-4 h-4 flex items-center justify-center rounded hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-2.5 h-2.5 text-red-400/60" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getLabelFromObject(obj: fabric.FabricObject, type: string, index: number): string {
  const o = obj as fabric.FabricObject & { _elementId?: string; text?: string };
  if ((type === "text" || type === "i-text") && o.text) {
    return o.text.slice(0, 22) || `Text ${index + 1}`;
  }
  const names: Record<string, string> = {
    text: "Text",
    rect: "Rectangle",
    circle: "Circle",
    line: "Line",
    group: "Group",
    stat: "Stat Block",
    icon: "Icon",
    "i-text": "Text",
  };
  return `${names[type] || "Shape"} ${index + 1}`;
}
