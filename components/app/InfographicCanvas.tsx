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
import { toast } from "@/hooks/use-toast";
import type { InfographicData } from "@/types/infographic";

function getPointerCoordinates(event: fabric.TPointerEvent): { x: number; y: number } {
  if ("touches" in event && event.touches.length > 0) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  if ("clientX" in event) {
    return { x: event.clientX, y: event.clientY };
  }
  return { x: 0, y: 0 };
}

export interface CanvasRef {
  canvas: fabric.Canvas | null;
  renderData: (data: InfographicData) => Promise<void>;
  renderElement: (element: InfographicData["elements"][0]) => void;
  prepareForStream: (
    data: Pick<InfographicData, "canvasWidth" | "canvasHeight" | "background">,
  ) => void;
  finishStream: () => void;
  setStreamProgress: (progress: { current: number; total: number }) => void;
  exportPNG: () => void;
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
    const isSpacePressed = useRef(false);
    const isPanning = useRef(false);
    const panStart = useRef({ x: 0, y: 0 });
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
        backgroundColor: "#ffffff",
      });

      fabric.FabricObject.prototype.borderColor = "#F5C518";
      fabric.FabricObject.prototype.cornerColor = "#F5C518";
      fabric.FabricObject.prototype.cornerStyle = "circle";
      fabric.FabricObject.prototype.transparentCorners = false;
      fabric.FabricObject.prototype.cornerSize = 10;

      fabricRef.current = canvas;

      onReady?.(canvas);

      return () => {
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
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.code === "Space") {
          isSpacePressed.current = true;
          event.preventDefault();
        }
      };
      const onKeyUp = (event: KeyboardEvent) => {
        if (event.code === "Space") {
          isSpacePressed.current = false;
          isPanning.current = false;
        }
      };
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
      };
    }, []);

    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const onWheel = (opt: fabric.TEvent<WheelEvent>) => {
        const event = opt.e;
        event.preventDefault();
        event.stopPropagation();
        const delta = event.deltaY;
        const zoomFactor = delta > 0 ? 0.94 : 1.06;
        const point = new fabric.Point(event.offsetX, event.offsetY);
        canvas.zoomToPoint(point, Math.max(0.1, Math.min(2, canvas.getZoom() * zoomFactor)));
      };

      const onMouseDown = (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
        const shouldPan = toolMode === "hand" || isSpacePressed.current;
        if (!shouldPan) return;
        isPanning.current = true;
        panStart.current = getPointerCoordinates(opt.e);
      };
      const onMouseMove = (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
        if (!isPanning.current) return;
        const vpt = canvas.viewportTransform;
        if (!vpt) return;
        const point = getPointerCoordinates(opt.e);
        const dx = point.x - panStart.current.x;
        const dy = point.y - panStart.current.y;
        vpt[4] += dx;
        vpt[5] += dy;
        canvas.requestRenderAll();
        panStart.current = point;
      };
      const onMouseUp = () => {
        isPanning.current = false;
      };

      canvas.on("mouse:wheel", onWheel);
      canvas.on("mouse:down", onMouseDown);
      canvas.on("mouse:move", onMouseMove);
      canvas.on("mouse:up", onMouseUp);
      return () => {
        canvas.off("mouse:wheel", onWheel);
        canvas.off("mouse:down", onMouseDown);
        canvas.off("mouse:move", onMouseMove);
        canvas.off("mouse:up", onMouseUp);
      };
    }, [toolMode]);

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
        fabricRef.current.set("backgroundColor", data.background || "#ffffff");
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
      exportPNG: () => {
        if (!fabricRef.current) return;
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
        fabricRef.current.backgroundColor = "#ffffff";
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
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
          }}
        >
          <canvas ref={canvasRef} />
        </div>

        {isLoading && (
          <div className="absolute inset-0 rounded-lg bg-black/55">
            <div className="absolute inset-4 animate-pulse rounded-md border border-white/10 bg-[#0f0f0f]/80" />
            <div className="absolute left-1/2 top-1/2 flex w-[300px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-lg border border-white/10 bg-[#0f0f0f] p-4">
              <div className="h-3 w-full rounded bg-gradient-to-r from-white/5 via-white/15 to-white/5 [background-size:200%_100%] animate-[shimmer_1.3s_linear_infinite]" />
              <div className="w-56 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F5C518] transition-all duration-200"
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
