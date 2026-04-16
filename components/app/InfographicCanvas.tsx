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

export interface CanvasRef {
  canvas: fabric.Canvas | null;
  renderData: (data: InfographicData) => Promise<void>;
  renderElement: (element: InfographicData["elements"][0]) => void;
  prepareForStream: (
    data: Pick<InfographicData, "canvasWidth" | "canvasHeight" | "background">,
  ) => void;
  finishStream: () => void;
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
            current: prev.current + 1,
          }));
        }
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 transition-all duration-200"
                  style={{
                    width: `${(loadingProgress.current / loadingProgress.total) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-400">
                Rendering {loadingProgress.current} of {loadingProgress.total}{" "}
                elements
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
