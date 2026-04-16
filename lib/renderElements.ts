import * as fabric from 'fabric'
import type { InfographicElement, InfographicData } from '@/types/infographic'

export function createFabricObject(el: InfographicElement): fabric.FabricObject | null {
  const common = { selectable: true, hasControls: true, hasBorders: true }

  switch (el.type) {
    case 'rect': {
      const rect = new fabric.Rect({
        left: el.x,
        top: el.y,
        width: el.width,
        height: el.height,
        rx: el.rx ?? 0,
        ry: el.rx ?? 0,
        opacity: el.opacity ?? 1,
        ...common,
      })
      // Set fill explicitly after creation for proper rendering
      rect.set('fill', el.fill || '#000000')
      if (el.stroke) rect.set('stroke', el.stroke)
      if (el.strokeWidth) rect.set('strokeWidth', el.strokeWidth)
      return rect
    }

    case 'circle': {
      const circle = new fabric.Circle({
        left: el.x,
        top: el.y,
        radius: el.radius,
        opacity: el.opacity ?? 1,
        ...common,
      })
      circle.set('fill', el.fill || '#000000')
      if (el.stroke) circle.set('stroke', el.stroke)
      if (el.strokeWidth) circle.set('strokeWidth', el.strokeWidth)
      return circle
    }

    case 'text': {
      const text = new fabric.IText(el.text || '', {
        left: el.x,
        top: el.y,
        fontSize: el.fontSize || 16,
        fontWeight: el.fontWeight || 'normal',
        fontFamily: el.fontFamily || 'Arial',
        textAlign: el.textAlign || 'left',
        opacity: el.opacity ?? 1,
        ...common,
      })
      text.set('fill', el.fill || '#000000')
      // Limit text width to prevent overflow
      if (el.width && el.width > 0) {
        text.set('width', el.width)
      }
      return text
    }

    case 'line': {
      const line = new fabric.Line([el.x1, el.y1, el.x2, el.y2], {
        strokeDashArray: el.dashed ? [6, 4] : undefined,
        ...common,
      })
      line.set('stroke', el.stroke || '#000000')
      line.set('strokeWidth', el.strokeWidth || 1)
      return line
    }

    case 'stat': {
      const bg = new fabric.Rect({
        width: el.width || 140,
        height: el.height || 80,
        rx: el.rx ?? 8,
        ry: el.rx ?? 8,
        originX: 'center',
        originY: 'center',
      })
      bg.set('fill', el.bgFill || '#f0f0f5')
      
      const val = new fabric.IText(el.value || '', {
        fontSize: 36,
        fontWeight: '900',
        fontFamily: 'Impact',
        originX: 'center',
        originY: 'center',
        top: -10,
      })
      val.set('fill', el.valueFill || '#7c3aed')
      
      const lbl = new fabric.IText(el.label || '', {
        fontSize: 11,
        fontWeight: 'normal',
        fontFamily: 'Arial',
        originX: 'center',
        originY: 'center',
        top: (el.height || 80) / 2 - 18,
        textAlign: 'center',
      })
      lbl.set('fill', el.labelFill || '#666666')
      
      return new fabric.Group([bg, val, lbl], {
        left: el.x,
        top: el.y,
        ...common,
      })
    }

    case 'icon': {
      const bg = new fabric.Circle({
        radius: el.bgRadius || 24,
        originX: 'center',
        originY: 'center',
      })
      bg.set('fill', el.bgFill || '#7c3aed')
      
      const emoji = new fabric.Text(el.emoji || '', {
        fontSize: el.emojiSize || 24,
        originX: 'center',
        originY: 'center',
      })
      return new fabric.Group([bg, emoji], {
        left: el.x,
        top: el.y,
        ...common,
      })
    }

    default:
      return null
  }
}

export async function renderInfographic(
  canvas: fabric.Canvas,
  data: InfographicData,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  // Clear canvas completely
  canvas.clear()
  canvas.setWidth(data.canvasWidth)
  canvas.setHeight(data.canvasHeight)
  
  // Set background explicitly
  canvas.set('backgroundColor', data.background || '#ffffff')
  canvas.requestRenderAll()

  const sorted = [...data.elements].sort((a, b) => a.zIndex - b.zIndex)

  for (let i = 0; i < sorted.length; i++) {
    await new Promise((res) => setTimeout(res, 15))
    const obj = createFabricObject(sorted[i])
    if (obj) {
      ;(obj as fabric.FabricObject & { _elementId?: string; _elementType?: string })._elementId = sorted[i].id
      ;(obj as fabric.FabricObject & { _elementId?: string; _elementType?: string })._elementType = sorted[i].type
      canvas.add(obj)
      canvas.requestRenderAll()
      onProgress?.(i + 1, sorted.length)
    }
  }
  
  // Final render to ensure all objects are displayed
  await new Promise((res) => setTimeout(res, 50))
  canvas.requestRenderAll()
}

export function addTextElement(canvas: fabric.Canvas): void {
  const text = new fabric.IText('New Text', {
    left: 100,
    top: 100,
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#ffffff',
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })
  canvas.add(text)
  canvas.setActiveObject(text)
  canvas.renderAll()
}

export function addHeadingElement(canvas: fabric.Canvas): void {
  const heading = new fabric.IText('Heading', {
    left: 100,
    top: 100,
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fill: '#ffffff',
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })
  canvas.add(heading)
  canvas.setActiveObject(heading)
  canvas.renderAll()
}

export function addRectElement(canvas: fabric.Canvas): void {
  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    width: 200,
    height: 150,
    fill: '#7c3aed',
    rx: 8,
    ry: 8,
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })
  canvas.add(rect)
  canvas.setActiveObject(rect)
  canvas.renderAll()
}

export function addCircleElement(canvas: fabric.Canvas): void {
  const circle = new fabric.Circle({
    left: 100,
    top: 100,
    radius: 75,
    fill: '#4f46e5',
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })
  canvas.add(circle)
  canvas.setActiveObject(circle)
  canvas.renderAll()
}

export function addStatBlockElement(canvas: fabric.Canvas): void {
  const bg = new fabric.Rect({
    width: 180,
    height: 100,
    fill: '#1e1b4b',
    rx: 12,
    ry: 12,
    originX: 'center',
    originY: 'center',
  })
  const val = new fabric.IText('100%', {
    fontSize: 48,
    fontWeight: '900',
    fontFamily: 'Impact',
    fill: '#7c3aed',
    originX: 'center',
    originY: 'center',
    top: -12,
  })
  const lbl = new fabric.IText('stat label', {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Arial',
    fill: '#a5b4fc',
    originX: 'center',
    originY: 'center',
    top: 28,
    textAlign: 'center',
  })
  const group = new fabric.Group([bg, val, lbl], {
    left: 100,
    top: 100,
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })
  canvas.add(group)
  canvas.setActiveObject(group)
  canvas.renderAll()
}

export function addDividerLineElement(canvas: fabric.Canvas): void {
  const line = new fabric.Line([0, 0, 300, 0], {
    left: 100,
    top: 100,
    stroke: '#6b7280',
    strokeWidth: 2,
    selectable: true,
  })
  canvas.add(line)
  canvas.setActiveObject(line)
  canvas.renderAll()
}
