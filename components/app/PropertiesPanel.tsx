"use client";

import {
  ArrowUpToLine,
  ArrowDownToLine,
  Copy,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { FONT_FAMILIES } from "@/types/infographic";
import type { SelectionProperties } from "@/hooks/use-canvas-selection";

interface PropertiesPanelProps {
  properties: SelectionProperties | null;
  objectType: string | null;
  onUpdateProperty: (
    key: keyof SelectionProperties,
    value: number | string,
  ) => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAutoTheme?: () => void;
}

export default function PropertiesPanel({
  properties,
  objectType,
  onUpdateProperty,
  onBringToFront,
  onSendToBack,
  onDuplicate,
  onDelete,
  onAutoTheme,
}: PropertiesPanelProps) {
  const isText = objectType === "i-text" || objectType === "text";
  const isShape = objectType === "rect" || objectType === "circle";

  if (!properties) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center px-4 gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: "#161616",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <svg
            className="w-4 h-4"
            style={{ color: "#666666" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
            <path
              d="M9 9h6M9 12h6M9 15h4"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: "#666666" }}>
          Select an element
          <br />
          to edit properties
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full h-6 px-2 text-[11px] font-mono rounded outline-none transition-colors";
  const inputStyle = {
    backgroundColor: "#161616",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#E2E2E2",
  };
  const inputFocusStyle =
    "focus:border-[rgba(245,197,24,0.4)] focus:ring-1 focus:ring-[rgba(245,197,24,0.15)]";

  const labelCls = "text-[10px] font-medium uppercase tracking-wide";
  const labelStyle = { color: "#666666" };
  const sectionCls = "px-3 py-2.5 space-y-2";
  const sectionStyle = { borderBottom: "1px solid rgba(255,255,255,0.07)" };

  return (
    <div className="flex flex-col">
      {/* TRANSFORM */}
      <div className={sectionCls} style={sectionStyle}>
        <div className={labelCls} style={labelStyle}>
          Transform
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            {
              label: "X",
              key: "left" as const,
              val: Math.round(properties.left),
            },
            {
              label: "Y",
              key: "top" as const,
              val: Math.round(properties.top),
            },
            {
              label: "W",
              key: "width" as const,
              val: Math.round(properties.width),
            },
            {
              label: "H",
              key: "height" as const,
              val: Math.round(properties.height),
            },
          ].map(({ label, key, val }) => (
            <div key={key}>
              <div className={`${labelCls} mb-1`} style={labelStyle}>
                {label}
              </div>
              <input
                type="number"
                value={val}
                onChange={(e) => onUpdateProperty(key, Number(e.target.value))}
                className={`${inputCls} ${inputFocusStyle}`}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          <div>
            <div className={`${labelCls} mb-1`} style={labelStyle}>
              Rotation
            </div>
            <input
              type="number"
              value={Math.round(properties.angle)}
              onChange={(e) =>
                onUpdateProperty("angle", Number(e.target.value))
              }
              className={`${inputCls} ${inputFocusStyle}`}
              style={inputStyle}
            />
          </div>
          <div>
            <div className={`${labelCls} mb-1`} style={labelStyle}>
              Opacity
            </div>
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round(properties.opacity)}
              onChange={(e) =>
                onUpdateProperty("opacity", Number(e.target.value))
              }
              className={`${inputCls} ${inputFocusStyle}`}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* APPEARANCE  shapes only */}
      {isShape && (
        <div className={sectionCls} style={sectionStyle}>
          <div className={labelCls} style={labelStyle}>
            Appearance
          </div>
          <div className="space-y-1.5">
            {[
              {
                label: "Fill",
                key: "fill" as const,
                val: properties.fill || "#7c3aed",
              },
              {
                label: "Stroke",
                key: "stroke" as const,
                val: properties.stroke || "#000000",
              },
            ].map(({ label, key, val }) => (
              <div key={key}>
                <div className={`${labelCls} mb-1`} style={labelStyle}>
                  {label}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="color"
                    value={val}
                    onChange={(e) => onUpdateProperty(key, e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer p-0.5 shrink-0"
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      backgroundColor: "transparent",
                    }}
                  />
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => onUpdateProperty(key, e.target.value)}
                    className={`${inputCls} font-mono ${inputFocusStyle}`}
                    style={inputStyle}
                  />
                </div>
              </div>
            ))}
            {objectType === "rect" && (
              <div>
                <div className={`${labelCls} mb-1`} style={labelStyle}>
                  Radius
                </div>
                <input
                  type="number"
                  value={properties.rx || 0}
                  onChange={(e) =>
                    onUpdateProperty("rx", Number(e.target.value))
                  }
                  className={`${inputCls} ${inputFocusStyle}`}
                  style={inputStyle}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* TYPOGRAPHY  text only */}
      {isText && (
        <div className={sectionCls} style={sectionStyle}>
          <div className={labelCls} style={labelStyle}>
            Typography
          </div>
          <div className="space-y-1.5">
            <div>
              <div className={`${labelCls} mb-1`} style={labelStyle}>
                Font
              </div>
              <select
                value={properties.fontFamily || "Arial"}
                onChange={(e) => onUpdateProperty("fontFamily", e.target.value)}
                className={`${inputCls} cursor-pointer ${inputFocusStyle}`}
                style={inputStyle}
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <div className={`${labelCls} mb-1`} style={labelStyle}>
                  Size
                </div>
                <input
                  type="number"
                  value={properties.fontSize || 13}
                  onChange={(e) =>
                    onUpdateProperty("fontSize", Number(e.target.value))
                  }
                  className={`${inputCls} ${inputFocusStyle}`}
                  style={inputStyle}
                />
              </div>
              <div>
                <div className={`${labelCls} mb-1`} style={labelStyle}>
                  Weight
                </div>
                <select
                  value={properties.fontWeight || "normal"}
                  onChange={(e) =>
                    onUpdateProperty("fontWeight", e.target.value)
                  }
                  className={`${inputCls} cursor-pointer ${inputFocusStyle}`}
                  style={inputStyle}
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="900">Black</option>
                </select>
              </div>
            </div>
            <div className="flex gap-1">
              {[
                { val: "left", icon: AlignLeft },
                { val: "center", icon: AlignCenter },
                { val: "right", icon: AlignRight },
              ].map(({ val, icon: Icon }) => (
                <button
                  key={val}
                  onClick={() => onUpdateProperty("textAlign", val)}
                  className="flex-1 h-6 flex items-center justify-center rounded border transition-all"
                  style={{
                    backgroundColor:
                      properties.textAlign === val ? "#222222" : "transparent",
                    borderColor:
                      properties.textAlign === val
                        ? "rgba(245,197,24,0.4)"
                        : "rgba(255,255,255,0.08)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: "#A3A3A3" }} />
                </button>
              ))}
            </div>
            <div>
              <div className={`${labelCls} mb-1`} style={labelStyle}>
                Color
              </div>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={properties.fill || "#ffffff"}
                  onChange={(e) => onUpdateProperty("fill", e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer p-0.5 shrink-0"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    backgroundColor: "transparent",
                  }}
                />
                <input
                  type="text"
                  value={properties.fill || "#ffffff"}
                  onChange={(e) => onUpdateProperty("fill", e.target.value)}
                  className={`${inputCls} font-mono ${inputFocusStyle}`}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="px-3 py-2.5 space-y-1.5">
        {onAutoTheme && (
          <button
            onClick={onAutoTheme}
            className="mb-2 h-6 w-full rounded border border-white/10 text-[10px] text-white hover:border-[#F5C518]"
          >
            ✦ Auto Theme
          </button>
        )}
        <div className={labelCls} style={labelStyle}>
          Actions
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            {
              label: "Front",
              icon: ArrowUpToLine,
              onClick: onBringToFront,
              danger: false,
            },
            {
              label: "Back",
              icon: ArrowDownToLine,
              onClick: onSendToBack,
              danger: false,
            },
            {
              label: "Duplicate",
              icon: Copy,
              onClick: onDuplicate,
              danger: false,
            },
            { label: "Delete", icon: Trash2, onClick: onDelete, danger: true },
          ].map(({ label, icon: Icon, onClick, danger }) => (
            <button
              key={label}
              onClick={onClick}
              className="h-6 flex items-center justify-center gap-1 rounded text-[10px] transition-all active:scale-95"
              style={{
                backgroundColor: danger ? "rgba(239,68,68,0.07)" : "#161616",
                border: danger
                  ? "1px solid transparent"
                  : "1px solid rgba(255,255,255,0.08)",
                color: danger ? "#ef4444" : "#A3A3A3",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                if (danger) {
                  el.style.borderColor = "#ef4444";
                  el.style.backgroundColor = "#ef4444";
                  el.style.color = "#ffffff";
                } else {
                  el.style.borderColor = "rgba(245,197,24,0.3)";
                  el.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                if (danger) {
                  el.style.borderColor = "transparent";
                  el.style.backgroundColor = "rgba(239,68,68,0.07)";
                  el.style.color = "#ef4444";
                } else {
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.color = "#A3A3A3";
                }
              }}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
