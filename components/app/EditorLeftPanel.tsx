"use client";

import { useState } from "react";
import {
  Type,
  Square,
  Circle,
  BarChart2,
  Minus,
  ChevronDown,
  Layers,
  PlusCircle,
  Image as ImageIcon,
} from "lucide-react";
import LayersPanel from "@/components/app/LayersPanel";
import type * as fabric from "fabric";

type ElementType = "heading" | "text" | "rect" | "circle" | "stat" | "line";

interface EditorLeftPanelProps {
  canvas: fabric.Canvas | null;
  onAddElement: (type: ElementType) => void;
  onSelectObject: () => void;
  onCanvasChanged: () => void;
  refreshTrigger: number;
  onImportImage?: () => void;
}

const ELEMENT_GROUPS = [
  {
    label: "Text",
    items: [
      { id: "heading" as ElementType, Icon: Type, label: "Heading", description: "Large display text" },
      { id: "text" as ElementType, Icon: Type, label: "Body Text", description: "Paragraph or label" },
    ],
  },
  {
    label: "Shapes",
    items: [
      { id: "rect" as ElementType, Icon: Square, label: "Rectangle", description: "Box or container" },
      { id: "circle" as ElementType, Icon: Circle, label: "Circle", description: "Oval or dot" },
      { id: "line" as ElementType, Icon: Minus, label: "Divider", description: "Horizontal rule" },
    ],
  },
  {
    label: "Data",
    items: [
      { id: "stat" as ElementType, Icon: BarChart2, label: "Stat Block", description: "Number + label" },
    ],
  },
];

function SectionHeader({
  label,
  open,
  toggle,
}: {
  label: string;
  open: boolean;
  toggle: () => void;
}) {
  return (
    <button
      onClick={toggle}
      className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors group"
    >
      <span>{label}</span>
      <ChevronDown
        className={`w-3 h-3 transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
      />
    </button>
  );
}

export default function EditorLeftPanel({
  canvas,
  onAddElement,
  onSelectObject,
  onCanvasChanged,
  refreshTrigger,
  onImportImage,
}: EditorLeftPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Text: true,
    Shapes: true,
    Data: true,
  });

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel header */}
      <div className="px-3 py-3 border-b border-[var(--line-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-3.5 h-3.5 text-[var(--text-faint)]" />
          <span className="text-[12px] font-semibold text-[var(--text-primary)]">Elements</span>
        </div>
      </div>

      {/* Element sections */}
      <div className="flex-shrink-0 overflow-y-auto border-b border-[var(--line-subtle)]">
        {ELEMENT_GROUPS.map((group) => (
          <div key={group.label}>
            <SectionHeader
              label={group.label}
              open={openSections[group.label] ?? true}
              toggle={() => toggleSection(group.label)}
            />
            {(openSections[group.label] ?? true) && (
              <div className="px-2 pb-2 grid grid-cols-2 gap-1">
                {group.items.map((el) => (
                  <button
                    key={el.id}
                    onClick={() => onAddElement(el.id)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-md border border-[var(--line-subtle)] bg-[var(--surface-raised)] text-left transition-all hover:border-[var(--line-default)] hover:bg-[var(--fill-subtle)] active:scale-[0.97] group"
                  >
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-[var(--fill-default)] border border-[var(--line-subtle)] shrink-0">
                      <el.Icon className="w-3 h-3 text-[var(--text-body)] group-hover:text-[var(--text-primary)] transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] truncate transition-colors">
                        {el.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Media section */}
        {onImportImage && (
          <div>
            <SectionHeader
              label="Media"
              open={openSections["Media"] ?? true}
              toggle={() => toggleSection("Media")}
            />
            {(openSections["Media"] ?? true) && (
              <div className="px-2 pb-2">
                <button
                  onClick={onImportImage}
                  className="flex w-full items-center gap-2 px-2.5 py-2 rounded-md border border-[var(--line-subtle)] bg-[var(--surface-raised)] text-left transition-all hover:border-[var(--line-default)] hover:bg-[var(--fill-subtle)] active:scale-[0.97] group"
                >
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-[var(--fill-default)] border border-[var(--line-subtle)] shrink-0">
                    <ImageIcon className="w-3 h-3 text-[var(--text-body)] group-hover:text-[var(--text-primary)] transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] truncate transition-colors">
                      Import Image
                    </div>
                    <div className="text-[9px] text-[var(--text-faint)] truncate">PNG, JPG, SVG</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Layers section takes remaining space */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="px-3 py-2 flex items-center gap-2 border-b border-[var(--line-subtle)] shrink-0">
          <Layers className="w-3.5 h-3.5 text-[var(--text-faint)]" />
          <span className="text-[12px] font-semibold text-[var(--text-primary)]">Layers</span>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <LayersPanel
            canvas={canvas}
            onSelectObject={onSelectObject}
            refreshTrigger={refreshTrigger}
            onCanvasChanged={onCanvasChanged}
            hideSectionHeader
          />
        </div>
      </div>
    </div>
  );
}
