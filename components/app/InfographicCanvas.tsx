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

// The artboard and the selection handles must use real color values. Canvas
// rendering cannot resolve CSS custom properties, so the accent hex lives here.
const ARTBOARD_BACKGROUND = "#ffffff";
const SELECTION_COLOR = "#3b82f6";
const SELECTION_STROKE_COLOR = "#111113";

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
  exportSVG: () => void;
  importJSON: (file: File) => Promise<void>;
  importImage: (file: File) => Promise<void>;
  importSVG: (file: File) => Promise<void>;
  clearAll: () => void;
  getObjects: () => fabric.FabricObject[];
}

interface InfographicCanvasProps {
  width: number;
  height: number;
  zoom: number;
  toolMode?: "select" | "hand";
  snapToGrid?: boolean;
  gridSize?: number;
  onReady?: (canvas: fabric.Canvas) => void;
  onObjectModified?: () => void;
}

const InfographicCanvas = forwardRef<CanvasRef, InfographicCanvasProps>(
  (
    {
      width,
      height,
      zoom,
      toolMode = "select",
      snapToGrid = false,
      gridSize = 20,
      onReady,
      onObjectModified,
    },
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

    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas || !snapToGrid) return;
      const handleMoving = (event: fabric.TEvent) => {
        const target = (event as unknown as { target?: fabric.FabricObject }).target;
        if (!target) return;
        target.set({
          left: Math.round((target.left || 0) / gridSize) * gridSize,
          top: Math.round((target.top || 0) / gridSize) * gridSize,
        });
      };
      canvas.on("object:moving", handleMoving);
      return () => {
        canvas.off("object:moving", handleMoving);
      };
    }, [snapToGrid, gridSize]);

    // Zoom and panning are handled by the editor viewport container, so this
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
      exportSVG: () => {
        if (!fabricRef.current) return;
        const svg = fabricRef.current.toSVG();
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "infographic.svg";
        a.click();
        URL.revokeObjectURL(url);
        toast({
          title: "Success",
          description: "Infographic exported as SVG",
        });
      },
      importJSON: async (file: File) => {
        if (!fabricRef.current) return;
        try {
          const text = await file.text();
          const parsed = JSON.parse(text);
          if (typeof parsed !== "object" || parsed === null) {
            throw new Error("Invalid JSON");
          }
          await fabricRef.current.loadFromJSON(parsed);
          fabricRef.current.requestRenderAll();
          toast({
            title: "Imported",
            description: "JSON design document loaded",
          });
        } catch {
          toast({
            title: "Import failed",
            description: "Invalid or unsupported JSON file",
            variant: "destructive",
          });
        }
      },
      importImage: async (file: File) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        try {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });
          const image = await fabric.FabricImage.fromURL(dataUrl);
          const maxWidth = canvas.getWidth() * 0.8;
          const maxHeight = canvas.getHeight() * 0.8;
          const scale = Math.min(
            1,
            maxWidth / (image.width || maxWidth),
            maxHeight / (image.height || maxHeight),
          );
          image.set({
            left: (canvas.getWidth() - (image.width || 0) * scale) / 2,
            top: (canvas.getHeight() - (image.height || 0) * scale) / 2,
            scaleX: scale,
            scaleY: scale,
          });
          canvas.add(image);
          canvas.setActiveObject(image);
          canvas.renderAll();
          toast({ title: "Imported", description: "Image added to canvas" });
        } catch {
          toast({
            title: "Import failed",
            description: "Unsupported image file",
            variant: "destructive",
          });
        }
      },
      importSVG: async (file: File) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        try {
          const text = await file.text();
          const { objects } = await fabric.loadSVGFromString(text);
          const valid = objects.filter(Boolean) as fabric.FabricObject[];
          if (!valid.length) throw new Error("No SVG objects");
          const group = fabric.util.groupSVGElements(valid);
          group.set({
            left: (canvas.getWidth() - (group.width || 0)) / 2,
            top: (canvas.getHeight() - (group.height || 0)) / 2,
          });
          canvas.add(group);
          canvas.setActiveObject(group);
          canvas.renderAll();
          toast({ title: "Imported", description: "SVG added to canvas" });
        } catch {
          toast({
            title: "Import failed",
            description: "Invalid or unsupported SVG file",
            variant: "destructive",
          });
        }
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
            boxShadow: "0 2px 8px rgba(17,17,19,0.12), 0 8px 40px rgba(17,17,19,0.12), 0 0 0 1px rgba(16,17,19,0.05)",
          }}
        >
          <canvas ref={canvasRef} />
          {snapToGrid && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.08) 1px, transparent 1px)",
                backgroundSize: `${gridSize}px ${gridSize}px`,
              }}
            />
          )}
        </div>

        {isLoading && (
          <div className="absolute inset-0 rounded-lg bg-[var(--scrim)]">
            <div className="absolute inset-4 animate-pulse rounded-md border border-[var(--line-default)] bg-[var(--surface-base)]/80" />
            <div className="absolute left-1/2 top-1/2 flex w-[300px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-lg border border-[var(--line-default)] bg-[var(--surface-base)] p-4">
              <div className="h-3 w-full rounded bg-gradient-to-r from-[var(--fill-strong)] via-[var(--line-default)] to-[var(--fill-strong)] [background-size:200%_100%] animate-[shimmer_1.3s_linear_infinite]" />
              <div className="w-56 h-2 bg-[var(--line-default)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] transition-all duration-200"
                  style={{
                    width: `${loadingProgress.total > 0 ? (loadingProgress.current / loadingProgress.total) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
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
