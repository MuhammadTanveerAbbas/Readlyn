"use client";

import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import * as fabric from "fabric";
import { renderInfographic, createFabricObject } from "@/lib/renderElements";
import { ensureCanvasFontsLoaded } from "@/lib/canvas-fonts";
import { toast } from "@/hooks/use-toast";
import type { InfographicData } from "@/types/infographic";

// The artboard plus the selection handles must use real color values. Canvas
// rendering cannot resolve CSS custom properties, so the accent hex lives here.
const ARTBOARD_BACKGROUND = "#ffffff";
const SELECTION_COLOR = "#f5c518";
const SELECTION_STROKE_COLOR = "#0f0f0f";

export interface CanvasRef {
  canvas: fabric.Canvas | null;
  renderData: (data: InfographicData) => Promise<void>;
  renderElement: (element: InfographicData["elements"][0]) => void;
  prepareForStream: (
    data: Pick<InfographicData, "canvasWidth" | "canvasHeight" | "background">,
  ) => void;
  finishStream: () => void;
  setStreamProgress: (progress: { current: number; total: number }) => void;
  exportPNG: () => void | Promise<void>;
  exportJSON: () => void;
  clearAll: () => void;
  getObjects: () => fabric.FabricObject[];
}

interface InfographicCanvasProps {
  width: number;
  height: number;
  zoom: number;
  toolMode?: "select" | "hand";
  onReady?: (canvas: fabric.Canvas) => void;
  onObjectModified?: () => void;
}

const InfographicCanvas = forwardRef<CanvasRef, InfographicCanvasProps>(
  (
    { width, height, zoom, toolMode = "select", onReady, onObjectModified },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState({
      current: 0,
      total: 0,
    });

    useEffect(() => {
      if (!canvasRef.current || fabricRef.current) return;

      const canvas = new fabric.Canvas(canvasRef.current, {
        preserveObjectStacking: true,
        selection: true,
        width,
        height,
        backgroundColor: ARTBOARD_BACKGROUND,
      });

      fabric.FabricObject.prototype.borderColor = SELECTION_COLOR;
      fabric.FabricObject.prototype.cornerColor = SELECTION_COLOR;
      fabric.FabricObject.prototype.cornerStrokeColor = SELECTION_STROKE_COLOR;
      fabric.FabricObject.prototype.cornerStyle = "circle";
      fabric.FabricObject.prototype.transparentCorners = false;
      fabric.FabricObject.prototype.cornerSize = 10;

      fabricRef.current = canvas;

      onReady?.(canvas);

      // Preload the webfonts and repaint once they are resident, so text added
      // right after mount is measured against the real typeface instead of the
      // canvas fallback metrics (which differ and cause visible reflow).
      let cancelled = false;
      void ensureCanvasFontsLoaded().then(() => {
        if (!cancelled) canvas.requestRenderAll();
      });

      return () => {
        cancelled = true;
        canvas.dispose();
        fabricRef.current = null;
      };
    }, []);

    // Attach event listeners separately so they update when onObjectModified changes
    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      canvas.on("object:modified", () => onObjectModified?.());
      canvas.on("object:added", () => onObjectModified?.());
      canvas.on("object:removed", () => onObjectModified?.());

      return () => {
        canvas.off("object:modified");
        canvas.off("object:added");
        canvas.off("object:removed");
      };
    }, [onObjectModified]);

    // Disable Fabric selection/interaction in hand mode
    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const isHand = toolMode === "hand";
      canvas.selection = !isHand;
      canvas.getObjects().forEach((obj) => {
        obj.selectable = !isHand;
        obj.evented = !isHand;
      });
      canvas.requestRenderAll();
    }, [toolMode]);

    // Zoom plus panning are handled by the editor viewport container, so this
    // component only listens for object level changes.
    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      return () => {
        canvas.off("mouse:wheel");
        canvas.off("mouse:down");
        canvas.off("mouse:move");
        canvas.off("mouse:up");
      };
    }, []);

    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.renderAll();
    }, [width, height]);

    useImperativeHandle(ref, () => ({
      canvas: fabricRef.current,
      renderData: async (data: InfographicData) => {
        if (!fabricRef.current) return;
        setIsLoading(true);
        setLoadingProgress({ current: 0, total: data.elements.length });

        await renderInfographic(fabricRef.current, data, (current, total) => {
          setLoadingProgress({ current, total });
        });

        setIsLoading(false);
      },
      prepareForStream: (
        data: Pick<
          InfographicData,
          "canvasWidth" | "canvasHeight" | "background"
        >,
      ) => {
        if (!fabricRef.current) return;
        fabricRef.current.clear();
        fabricRef.current.setWidth(data.canvasWidth);
        fabricRef.current.setHeight(data.canvasHeight);
        fabricRef.current.set("backgroundColor", data.background || ARTBOARD_BACKGROUND);
        fabricRef.current.requestRenderAll();
        setIsLoading(true);
        setLoadingProgress({ current: 0, total: 50 });
      },
      renderElement: (element: InfographicData["elements"][0]) => {
        if (!fabricRef.current) return;
        const obj = createFabricObject(element);
        if (obj) {
          const isHand = toolMode === "hand";
          (
            obj as fabric.FabricObject & {
              _elementId?: string;
              _elementType?: string;
            }
          )._elementId = element.id;
          (
            obj as fabric.FabricObject & {
              _elementId?: string;
              _elementType?: string;
            }
          )._elementType = element.type;
          obj.selectable = !isHand;
          obj.evented = !isHand;
          fabricRef.current.add(obj);
          fabricRef.current.requestRenderAll();
          setLoadingProgress((prev) => ({
            ...prev,
            current: Math.min(prev.total || 1, prev.current + 1),
          }));
        }
      },
      setStreamProgress: (progress) => {
        setLoadingProgress(progress);
      },
      finishStream: () => {
        setIsLoading(false);
        if (fabricRef.current) {
          fabricRef.current.requestRenderAll();
        }
      },
      exportPNG: async () => {
        if (!fabricRef.current) return;
        // Ensure the webfonts are resident: a <canvas> silently substitutes a
        // fallback face for any family that has not finished loading.
        await ensureCanvasFontsLoaded();
        const url = fabricRef.current.toDataURL({
          format: "png",
          multiplier: 2,
        });
        const a = document.createElement("a");
        a.href = url;
        a.download = "infographic.png";
        a.click();
        toast({
          title: "Success",
          description: "Infographic exported as PNG",
        });
      },
      exportJSON: () => {
        if (!fabricRef.current) return;
        const json = JSON.stringify(fabricRef.current.toJSON(), null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "infographic.json";
        a.click();
        URL.revokeObjectURL(url);
        toast({
          title: "Success",
          description: "Infographic exported as JSON",
        });
      },
      clearAll: () => {
        if (!fabricRef.current) return;
        fabricRef.current.clear();
        fabricRef.current.backgroundColor = ARTBOARD_BACKGROUND;
        fabricRef.current.renderAll();
      },
      getObjects: () => {
        if (!fabricRef.current) return [];
        return fabricRef.current.getObjects();
      },
    }));

    return (
      <div
        className="relative flex-shrink-0"
        style={{
          width: width * zoom,
          height: height * zoom,
        }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            width,
            height,
            position: "absolute",
            top: 0,
            left: 0,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3), 0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <canvas ref={canvasRef} />
        </div>

        {isLoading && (
          <div className="absolute inset-0 rounded-lg bg-black/55">
            <div className="absolute inset-4 animate-pulse rounded-md border border-white/10 bg-[var(--bg-panel)]/80" />
            <div className="absolute left-1/2 top-1/2 flex w-[300px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-lg border border-white/10 bg-[var(--bg-panel)] p-4">
              <div className="h-3 w-full rounded bg-gradient-to-r from-white/5 via-white/15 to-white/5 [background-size:200%_100%] animate-[shimmer_1.3s_linear_infinite]" />
              <div className="w-56 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] transition-all duration-200"
                  style={{
                    width: `${loadingProgress.total > 0 ? (loadingProgress.current / loadingProgress.total) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-sm text-white/80">
                Generating layout... {loadingProgress.current}/{loadingProgress.total} elements
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
);

InfographicCanvas.displayName = "InfographicCanvas";

export default InfographicCanvas;
