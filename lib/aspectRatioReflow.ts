import * as fabric from "fabric";
import { CANVAS_SIZES, type CanvasSize } from "@/types/infographic";

/**
 * Intelligent aspect-ratio reflow for canvas elements when switching size (A4, Square, Wide)
 */
export function reflowCanvasLayout(
  canvas: fabric.Canvas,
  newSize: CanvasSize,
  oldSize: CanvasSize
) {
  const oldDimensions = CANVAS_SIZES[oldSize];
  const newDimensions = CANVAS_SIZES[newSize];

  const scaleX = newDimensions.width / oldDimensions.width;
  const scaleY = newDimensions.height / oldDimensions.height;

  canvas.setWidth(newDimensions.width);
  canvas.setHeight(newDimensions.height);

  const objects = canvas.getObjects();
  objects.forEach((obj) => {
    // Re-position proportionally
    const curLeft = obj.left || 0;
    const curTop = obj.top || 0;

    obj.set({
      left: curLeft * scaleX,
      top: curTop * scaleY,
    });

    // For non-full background rects, scale slightly to fit content
    if (obj.width && obj.height) {
      if (obj.width === oldDimensions.width && obj.height === oldDimensions.height) {
        // Full background element
        obj.set({
          width: newDimensions.width,
          height: newDimensions.height,
        });
      }
    }

    obj.setCoords();
  });

  canvas.requestRenderAll();
}
