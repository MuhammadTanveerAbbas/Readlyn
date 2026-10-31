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
import { FONT_FAMILIES, BODY_FONT } from "@/types/infographic";
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
            backgroundColor: "var(--surface-raised)",
            border: "1px solid var(--line-default)",
          }}
        >
          <svg
            className="w-4 h-4"
            style={{ color: "var(--text-body)" }}
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
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-body)" }}>
          Select an element
          <br />
          to edit properties
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full h-6 px-2 text-[11px] font-sans rounded outline-none transition-colors";
  const inputStyle = {
    backgroundColor: "var(--surface-raised)",
    border: "1px solid var(--line-default)",
    color: "var(--text-secondary)",
  };
  const inputFocusStyle =
    "focus:border-[var(--line-strong)] focus:ring-1 focus:ring-[var(--fill-strong)]";

  const labelCls = "text-[10px] font-medium uppercase tracking-wide";
  const labelStyle = { color: "var(--text-body)" };
  const sectionCls = "px-3 py-2.5 space-y-2";
  const sectionStyle = { borderBottom: "1px solid rgba(16,17,19,0.07)" };

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
                val: properties.fill || "#0284c7",
              },
              {
                label: "Stroke",
                key: "stroke" as const,
                val: properties.stroke || "#111113",
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
                      border: "1px solid var(--line-default)",
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
            <div>
              <div className={`${labelCls} mb-1`} style={labelStyle}>
                Stroke Width
              </div>
              <input
                type="number"
                value={properties.strokeWidth || 0}
                onChange={(e) =>
                  onUpdateProperty("strokeWidth", Number(e.target.value))
                }
                className={`${inputCls} ${inputFocusStyle}`}
                style={inputStyle}
              />
            </div>
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
                Text
              </div>
              <textarea
                value={properties.text || ""}
                onChange={(e) => onUpdateProperty("text", e.target.value)}
                className={`${inputCls} ${inputFocusStyle} min-h-[48px] resize-y`}
                style={inputStyle}
              />
            </div>
            <div>
              <div className={`${labelCls} mb-1`} style={labelStyle}>
                Font
              </div>
              <select
                value={properties.fontFamily || BODY_FONT}
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
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <div className={`${labelCls} mb-1`} style={labelStyle}>
                  Line Height
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={properties.lineHeight ?? 1.16}
                  onChange={(e) =>
                    onUpdateProperty("lineHeight", Number(e.target.value))
                  }
                  className={`${inputCls} ${inputFocusStyle}`}
                  style={inputStyle}
                />
              </div>
              <div>
                <div className={`${labelCls} mb-1`} style={labelStyle}>
                  Letter Spacing
                </div>
                <input
                  type="number"
                  value={properties.charSpacing ?? 0}
                  onChange={(e) =>
                    onUpdateProperty("charSpacing", Number(e.target.value))
                  }
                  className={`${inputCls} ${inputFocusStyle}`}
                  style={inputStyle}
                />
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
                      properties.textAlign === val ? "var(--surface-overlay)" : "transparent",
                    borderColor:
                      properties.textAlign === val
                        ? "var(--line-strong)"
                        : "var(--line-default)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: "var(--text-body)" }} />
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
                  value={properties.fill || "var(--text-primary)"}
                  onChange={(e) => onUpdateProperty("fill", e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer p-0.5 shrink-0"
                  style={{
                    border: "1px solid var(--line-default)",
                    backgroundColor: "transparent",
                  }}
                />
                <input
                  type="text"
                  value={properties.fill || "var(--text-primary)"}
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
            className="mb-2 h-6 w-full rounded border border-[var(--line-default)] text-[10px] text-[var(--text-primary)] hover:border-[var(--accent)]"
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
              className={`h-6 flex items-center justify-center gap-1 rounded text-[10px] transition-all active:scale-95 ${
                danger
                  ? "bg-[var(--danger-soft)] border border-transparent text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white hover:border-[var(--danger)]"
                  : "border border-[var(--line-default)] text-[var(--text-body)] hover:border-[var(--line-strong)] hover:text-[var(--text-primary)]"
              }`}
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
