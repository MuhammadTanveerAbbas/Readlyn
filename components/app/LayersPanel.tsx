"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, EyeOff, Lock, LockOpen, Trash2 } from "lucide-react";
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
  onAddMissingSection?: () => void;
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  text: { bg: "#1d4ed8", text: "#fff" },
  rect: { bg: "#065f46", text: "#fff" },
  circle: { bg: "#9a3412", text: "#fff" },
  line: { bg: "#374151", text: "#fff" },
  group: { bg: "#7c3aed", text: "#fff" },
  stat: { bg: "#b45309", text: "#fff" },
  icon: { bg: "#0369a1", text: "#fff" },
};

export default function LayersPanel({
  canvas,
  onSelectObject,
  refreshTrigger,
  onAddMissingSection,
}: LayersPanelProps) {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const refreshLayers = useCallback(() => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    const layerItems: LayerItem[] = objects
      .map((obj, index) => {
        const objWithMeta = obj as fabric.FabricObject & {
          _elementType?: string;
          _elementId?: string;
        };
        const type = objWithMeta._elementType || getObjectType(obj);
        return {
          id: objWithMeta._elementId || `obj-${index}`,
          type,
          label: `${type} ${objects.length - index}`,
          visible: obj.visible !== false,
          locked: obj.selectable === false,
          object: obj,
        };
      })
      .reverse();

    setLayers(layerItems);
  }, [canvas]);

  useEffect(() => {
    refreshLayers();
  }, [refreshLayers, refreshTrigger]);

  useEffect(() => {
    if (!canvas) return;

    const handleChange = () => refreshLayers();

    canvas.on("object:added", handleChange);
    canvas.on("object:removed", handleChange);

    return () => {
      canvas.off("object:added", handleChange);
      canvas.off("object:removed", handleChange);
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

  const selectLayer = (layer: LayerItem) => {
    if (!canvas || layer.locked) return;
    canvas.setActiveObject(layer.object);
    canvas.renderAll();
    setSelected(layer.id);
    onSelectObject(layer.object);
  };

  const typeColor = (type: string) => {
    return TYPE_COLORS[type] || TYPE_COLORS.group;
  };

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div
          className="text-[10px] font-semibold uppercase tracking-wide"
          style={{ color: "#666666" }}
        >
          Layers
        </div>
        <div className="text-[10px] font-medium" style={{ color: "#666666" }}>
          {layers.length}
        </div>
      </div>
      {onAddMissingSection && (
        <div className="px-3 pb-2">
          <button
            onClick={onAddMissingSection}
            className="h-6 w-full rounded border border-white/10 text-[10px] text-white hover:border-[#F5C518]"
          >
            ✦ Add Missing Section
          </button>
        </div>
      )}

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {layers.length === 0 ? (
          <div
            className="flex items-center justify-center h-20 text-[11px]"
            style={{ color: "#666666" }}
          >
            No layers
          </div>
        ) : (
          <div className="space-y-0.5">
            {layers.map((layer) => {
              const color = typeColor(layer.type);
              const isSelected = selected === layer.id;

              return (
                <div
                  key={layer.id}
                  onClick={() => selectLayer(layer)}
                  className={`
                    group flex items-center gap-2 p-2 rounded text-[11px] transition-all duration-150 cursor-pointer
                    ${isSelected ? "bg-[rgba(245,197,24,0.08)] border-l-2 border-[#F5C518]" : "hover:bg-white/5"}
                    ${layer.locked ? "opacity-60" : ""}
                  `}
                >
                  {/* Type Badge */}
                  <div
                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase shrink-0 w-9 text-center"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    {layer.type.slice(0, 4)}
                  </div>

                  {/* Layer Name */}
                  <span
                    className="flex-1 truncate"
                    style={{ color: "#E2E2E2" }}
                  >
                    {layer.label}
                  </span>

                  {/* Actions (visible on hover) */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => toggleVisibility(layer, e)}
                      className="p-1 rounded transition-colors hover:bg-white/10"
                      title={layer.visible ? "Hide" : "Show"}
                    >
                      {layer.visible ? (
                        <Eye className="w-3 h-3" style={{ color: "#A3A3A3" }} />
                      ) : (
                        <EyeOff
                          className="w-3 h-3"
                          style={{ color: "#666666" }}
                        />
                      )}
                    </button>
                    <button
                      onClick={(e) => toggleLock(layer, e)}
                      className="p-1 rounded transition-colors hover:bg-white/10"
                      title={layer.locked ? "Unlock" : "Lock"}
                    >
                      {layer.locked ? (
                        <Lock
                          className="w-3 h-3"
                          style={{ color: "#A3A3A3" }}
                        />
                      ) : (
                        <LockOpen
                          className="w-3 h-3"
                          style={{ color: "#A3A3A3" }}
                        />
                      )}
                    </button>
                    <button
                      onClick={(e) => deleteLayer(layer, e)}
                      className="p-1 rounded transition-colors hover:bg-[rgba(239,68,68,0.1)]"
                      title="Delete"
                    >
                      <Trash2
                        className="w-3 h-3"
                        style={{ color: "#A3A3A3" }}
                      />
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

function getObjectType(obj: fabric.FabricObject): string {
  if (obj.type === "i-text" || obj.type === "text") return "text";
  if (obj.type === "rect") return "rect";
  if (obj.type === "circle") return "circle";
  if (obj.type === "line") return "line";
  if (obj.type === "group") return "group";
  return obj.type || "shape";
}
