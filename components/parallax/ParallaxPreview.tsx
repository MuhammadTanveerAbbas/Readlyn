"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import type { ParallaxConfig } from "@/lib/parallax-types"

interface ParallaxPreviewProps {
  config: ParallaxConfig
  cinemaMode: boolean
}

export default function ParallaxPreview({ config, cinemaMode }: ParallaxPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [_progress, setProgress] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const state = useRef({
    value: 0,
    velocity: 0,
    dragging: false,
    dragStartY: 0,
    dragStartProgress: 0,
  })
  const raf = useRef<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const visibleLayers = config.layers.filter((l) => l.visible)

  const setTarget = useCallback((target: number) => {
    state.current.value = Math.max(0, Math.min(1, target))
    setProgress(state.current.value)
  }, [])

  const applyInertia = useCallback(() => {
    const s = state.current
    s.velocity *= 0.92
    s.value = Math.max(0, Math.min(1, s.value + s.velocity))
    if (s.value <= 0 || s.value >= 1) s.velocity *= 0.5
    if (Math.abs(s.velocity) > 0.0001) {
      setProgress(s.value)
      raf.current = requestAnimationFrame(applyInertia)
    } else {
      setProgress(Math.round(s.value * 100) / 100)
      raf.current = null
    }
  }, [])

  const addVelocity = useCallback((v: number) => {
    const s = state.current
    s.velocity += v
    if (!raf.current) raf.current = requestAnimationFrame(applyInertia)
  }, [applyInertia])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      addVelocity(e.deltaY * 0.0015)
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      const s = state.current
      s.dragging = true
      s.dragStartY = e.clientY
      s.dragStartProgress = s.value
      s.velocity = 0
      if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null }
      setDragging(true)
      el.style.cursor = "grabbing"
    }

    const onMouseMove = (e: MouseEvent) => {
      const s = state.current
      if (!s.dragging) return
      e.preventDefault()
      const dy = e.clientY - s.dragStartY
      setTarget(s.dragStartProgress + dy * 0.002)
    }

    const onMouseUp = () => {
      const s = state.current
      if (s.dragging) {
        s.dragging = false
        setDragging(false)
        if (containerRef.current) containerRef.current.style.cursor = "grab"
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return
      if (e.key === "ArrowDown" || e.key === "ArrowRight") addVelocity(0.04)
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") addVelocity(-0.04)
      else if (e.key === "Home") { setTarget(0); state.current.velocity = 0 }
      else if (e.key === "End") { setTarget(1); state.current.velocity = 0 }
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    el.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("keydown", onKey)

    el.style.cursor = "grab"

    return () => {
      el.removeEventListener("wheel", onWheel)
      el.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("keydown", onKey)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [addVelocity, setTarget])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (config.effect !== "tilt") return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }, [config.effect])

  const getLayerStyle = (depth: number) => {
    if (config.effect === "tilt") {
      const tx = (mousePos.x - 0.5) * depth * 40
      const ty = (mousePos.y - 0.5) * depth * 40
      return { transform: `translateX(${tx}px) translateY(${ty}px)`, opacity: undefined as number | undefined }
    }

    const translateY = state.current.value * depth * 200
    let scale = 1
    let opacity: number | undefined

    if (config.effect === "zoom") {
      scale = 1 + state.current.value * depth * 0.5
    }
    if (config.effect === "fade") {
      opacity = Math.max(0, 1 - state.current.value * depth * 0.6)
    }

    return { transform: `translateY(${translateY}px) scale(${scale})`, opacity }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none outline-none"
      style={{
        perspective: `${config.perspective || 1000}px`,
        background: config.backgroundColor,
      }}
      tabIndex={0}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {visibleLayers.map((layer) => {
          const s = getLayerStyle(layer.depth)
          return (
            <div
              key={layer.id}
              className="absolute inset-[-20%] pointer-events-none will-change-transform parallax-layer"
              style={{
                backgroundImage: `url(${layer.imageUrl})`,
                backgroundPosition: `${50 + layer.offsetX}% ${50 + layer.offsetY}%`,
                backgroundSize: "cover",
                opacity: s.opacity ?? layer.opacity,
                mixBlendMode: layer.blendMode as any,
                transform: s.transform,
                transition: config.effect === "tilt" ? "transform 0.15s ease-out" : "none",
              }}
            />
          )
        })}
      </div>

      {config.effect !== "tilt" && (
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center p-1">
                  <div
                    className="w-1 h-1.5 rounded-full bg-white/30"
                    style={{ animation: "parallax-scroll-hint 2s ease-in-out infinite" }}
                  />
                </div>
                <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">
                  {dragging ? "Dragging..." : "Scroll or drag"}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div className="w-1 h-24 rounded-full bg-white/10 pointer-events-none overflow-hidden">
              <div
                className="w-full rounded-full bg-[#F5C518]/60 transition-all duration-75"
                style={{ height: `${state.current.value * 100}%` }}
              />
            </div>
            <span className="text-[8px] font-mono text-white/30">
              {Math.round(state.current.value * 100)}%
            </span>
          </div>
        </>
      )}

      {!cinemaMode && (
        <div className="absolute top-2 left-2 z-50 px-1.5 py-0.5 rounded text-[8px] font-mono bg-black/60 text-white/50 backdrop-blur pointer-events-none uppercase tracking-widest">
          Preview
        </div>
      )}

      <style>{`
        @keyframes parallax-scroll-hint {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(10px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
