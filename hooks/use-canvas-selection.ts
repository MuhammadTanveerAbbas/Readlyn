'use client'

import { useState, useCallback, useEffect } from 'react'
import type * as fabric from 'fabric'

export interface SelectionProperties {
  left: number
  top: number
  width: number
  height: number
  angle: number
  opacity: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  fontSize?: number
  fontWeight?: string
  fontFamily?: string
  textAlign?: string
  rx?: number
  text?: string
}

export function useCanvasSelection(canvas: fabric.Canvas | null) {
  const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null)
  const [properties, setProperties] = useState<SelectionProperties | null>(null)

  const updateProperties = useCallback((obj: fabric.FabricObject | null) => {
    if (!obj) {
      setProperties(null)
      return
    }

    const scaleX = obj.scaleX || 1
    const scaleY = obj.scaleY || 1

    const props: SelectionProperties = {
      left: Math.round(obj.left || 0),
      top: Math.round(obj.top || 0),
      width: Math.round((obj.width || 0) * scaleX),
      height: Math.round((obj.height || 0) * scaleY),
      angle: Math.round(obj.angle || 0),
      opacity: Math.round((obj.opacity || 1) * 100),
    }

    if ('fill' in obj && typeof obj.fill === 'string') {
      props.fill = obj.fill
    }

    if ('stroke' in obj) {
      props.stroke = obj.stroke as string
      props.strokeWidth = obj.strokeWidth
    }

    if ('fontSize' in obj) {
      props.fontSize = (obj as fabric.IText).fontSize
      props.fontWeight = (obj as fabric.IText).fontWeight as string
      props.fontFamily = (obj as fabric.IText).fontFamily
      props.textAlign = (obj as fabric.IText).textAlign
      props.text = (obj as fabric.IText).text
    }

    if ('rx' in obj) {
      props.rx = (obj as fabric.Rect).rx
    }

    setProperties(props)
  }, [])

  useEffect(() => {
    if (!canvas) return

    const handleSelect = () => {
      const active = canvas.getActiveObject()
      setSelectedObject(active || null)
      updateProperties(active || null)
    }

    const handleClear = () => {
      setSelectedObject(null)
      setProperties(null)
    }

    const handleModified = () => {
      const active = canvas.getActiveObject()
      updateProperties(active || null)
    }

    canvas.on('selection:created', handleSelect)
    canvas.on('selection:updated', handleSelect)
    canvas.on('selection:cleared', handleClear)
    canvas.on('object:modified', handleModified)
    canvas.on('object:moving', handleModified)
    canvas.on('object:scaling', handleModified)
    canvas.on('object:rotating', handleModified)

    return () => {
      canvas.off('selection:created', handleSelect)
      canvas.off('selection:updated', handleSelect)
      canvas.off('selection:cleared', handleClear)
      canvas.off('object:modified', handleModified)
      canvas.off('object:moving', handleModified)
      canvas.off('object:scaling', handleModified)
      canvas.off('object:rotating', handleModified)
    }
  }, [canvas, updateProperties])

  const updateObject = useCallback(
    (key: keyof SelectionProperties, value: number | string) => {
      if (!selectedObject || !canvas) return

      switch (key) {
        case 'left':
          selectedObject.set('left', value as number)
          break
        case 'top':
          selectedObject.set('top', value as number)
          break
        case 'width':
          selectedObject.set('scaleX', (value as number) / (selectedObject.width || 1))
          break
        case 'height':
          selectedObject.set('scaleY', (value as number) / (selectedObject.height || 1))
          break
        case 'angle':
          selectedObject.set('angle', value as number)
          break
        case 'opacity':
          selectedObject.set('opacity', (value as number) / 100)
          break
        case 'fill':
          if ('fill' in selectedObject) {
            selectedObject.set('fill', value as string)
          }
          break
        case 'stroke':
          if ('stroke' in selectedObject) {
            selectedObject.set('stroke', value as string)
          }
          break
        case 'strokeWidth':
          if ('strokeWidth' in selectedObject) {
            selectedObject.set('strokeWidth', value as number)
          }
          break
        case 'fontSize':
          if ('fontSize' in selectedObject) {
            ;(selectedObject as fabric.IText).set('fontSize', value as number)
          }
          break
        case 'fontWeight':
          if ('fontWeight' in selectedObject) {
            ;(selectedObject as fabric.IText).set('fontWeight', value as string)
          }
          break
        case 'fontFamily':
          if ('fontFamily' in selectedObject) {
            ;(selectedObject as fabric.IText).set('fontFamily', value as string)
          }
          break
        case 'textAlign':
          if ('textAlign' in selectedObject) {
            ;(selectedObject as fabric.IText).set('textAlign', value as string)
          }
          break
        case 'rx':
          if ('rx' in selectedObject) {
            ;(selectedObject as fabric.Rect).set('rx', value as number)
            ;(selectedObject as fabric.Rect).set('ry', value as number)
          }
          break
      }

      selectedObject.setCoords()
      canvas.renderAll()
      updateProperties(selectedObject)
    },
    [selectedObject, canvas, updateProperties]
  )

  const bringToFront = useCallback(() => {
    if (!selectedObject || !canvas) return
    canvas.bringObjectToFront(selectedObject)
    canvas.renderAll()
  }, [selectedObject, canvas])

  const sendToBack = useCallback(() => {
    if (!selectedObject || !canvas) return
    canvas.sendObjectToBack(selectedObject)
    canvas.renderAll()
  }, [selectedObject, canvas])

  const duplicateObject = useCallback(() => {
    if (!selectedObject || !canvas) return
    selectedObject.clone().then((cloned: fabric.FabricObject) => {
      cloned.set({
        left: (selectedObject.left || 0) + 20,
        top: (selectedObject.top || 0) + 20,
      })
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
    })
  }, [selectedObject, canvas])

  const deleteObject = useCallback(() => {
    if (!selectedObject || !canvas) return
    canvas.remove(selectedObject)
    setSelectedObject(null)
    setProperties(null)
    canvas.renderAll()
  }, [selectedObject, canvas])

  return {
    selectedObject,
    properties,
    updateObject,
    bringToFront,
    sendToBack,
    duplicateObject,
    deleteObject,
  }
}
