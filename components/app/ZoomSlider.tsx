"use client";

import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface ZoomSliderProps {
  zoom: number;
  min?: number;
  max?: number;
  onZoomChange: (zoom: number) => void;
  onFitToScreen: () => void;
}

const MIN = 0.1;
const MAX = 2.0;
const STEP = 0.05;

function zoomToSlider(zoom: number) {
  return ((zoom - MIN) / (MAX - MIN)) * 100;
}

function sliderToZoom(pos: number) {
  return Math.round((MIN + (pos / 100) * (MAX - MIN)) * 100) / 100;
}

const btnCls =
  "w-6 h-6 flex items-center justify-center rounded transition-all active:scale-90";
const btnStyle = { color: "var(--text-body)" };

export default function ZoomSlider({
  zoom,
  onZoomChange,
  onFitToScreen,
}: ZoomSliderProps) {
  const sliderValue = zoomToSlider(zoom);
  const pct = Math.round(zoom * 100);

  return (
    <div
      className="w-9 flex-shrink-0 flex flex-col items-center py-3 gap-3"
      style={{
        backgroundColor: "var(--bg-panel)",
        borderLeft: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Zoom In */}
      <button
        onClick={() =>
          onZoomChange(Math.min(MAX, Math.round((zoom + STEP) * 100) / 100))
        }
        className={btnCls}
        style={btnStyle}
        title="Zoom in"
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-body)")}
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>

      {/* Vertical slider */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={sliderValue}
          onChange={(e) => onZoomChange(sliderToZoom(Number(e.target.value)))}
          style={
            {
              writingMode: "vertical-lr" as React.CSSProperties["writingMode"],
              direction: "rtl" as React.CSSProperties["direction"],
              width: "4px",
              height: "120px",
              cursor: "pointer",
              appearance:
                "slider-vertical" as React.CSSProperties["appearance"],
              WebkitAppearance:
                "slider-vertical" as React.CSSProperties["WebkitAppearance"],
              accentColor: "var(--accent)",
            } as React.CSSProperties
          }
          title={`Zoom: ${pct}%`}
        />
      </div>

      {/* Zoom % */}
      <div
        className="text-[9px] font-mono leading-none"
        style={{ color: "var(--text-muted-val)" }}
      >
        {pct}%
      </div>

      {/* Zoom Out */}
      <button
        onClick={() =>
          onZoomChange(Math.max(MIN, Math.round((zoom - STEP) * 100) / 100))
        }
        className={btnCls}
        style={btnStyle}
        title="Zoom out"
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-body)")}
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>

      {/* Fit to screen */}
      <button
        onClick={onFitToScreen}
        className={btnCls}
        style={{ color: "var(--text-muted-val)" }}
        title="Fit to screen"
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted-val)")}
      >
        <Maximize className="w-3 h-3" />
      </button>
    </div>
  );
}
