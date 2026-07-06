"use client"

import type { ParallaxConfig, ParallaxLayer, BlendMode, EffectType } from "@/lib/parallax-types"
import { BLEND_MODES, createLayer } from "@/lib/parallax-types"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Eye, EyeOff, Trash2, GripVertical, Plus, Copy,
} from "lucide-react"
import ImagePicker from "./ImagePicker"

interface ConfigPanelProps {
  config: ParallaxConfig
  setConfig: (config: ParallaxConfig) => void
}

export default function ConfigPanel({ config, setConfig }: ConfigPanelProps) {
  const updateLayer = (id: string, patch: Partial<ParallaxLayer>) => {
    setConfig({
      ...config,
      layers: config.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    })
  }

  const removeLayer = (id: string) => {
    if (config.layers.length <= 1) return
    setConfig({ ...config, layers: config.layers.filter((l) => l.id !== id) })
  }

  const addLayer = () => {
    const newLayer = createLayer({
      label: `Layer ${config.layers.length + 1}`,
      depth: 0.5,
    })
    setConfig({ ...config, layers: [...config.layers, newLayer] })
  }

  const duplicateLayer = (id: string) => {
    const source = config.layers.find((l) => l.id === id)
    if (!source) return
    const dup = createLayer({ ...source, label: `${source.label} Copy` })
    setConfig({ ...config, layers: [...config.layers, dup] })
  }

  const moveLayer = (id: string, direction: "up" | "down") => {
    const idx = config.layers.findIndex((l) => l.id === id)
    if (idx < 0) return
    const newIdx = direction === "up" ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= config.layers.length) return
    const layers = [...config.layers]
    ;[layers[idx], layers[newIdx]] = [layers[newIdx], layers[idx]]
    setConfig({ ...config, layers })
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white/80 uppercase tracking-wider">Layers</h3>
            <span className="text-[10px] text-white/40">{config.layers.length} layers</span>
          </div>

          <div className="space-y-2 mb-3">
            <div>
              <label className="text-[10px] text-white/50 uppercase tracking-wider block mb-1">Perspective</label>
              <input
                type="range"
                min="400"
                max="2000"
                step="100"
                value={config.perspective}
                onChange={(e) => setConfig({ ...config, perspective: Number(e.target.value) })}
                className="w-full accent-[#F5C518] h-1 rounded-full appearance-none bg-white/10 cursor-pointer"
              />
              <span className="text-[10px] text-white/40 mt-0.5 block text-right">{config.perspective}px</span>
            </div>

            <div>
              <label className="text-[10px] text-white/50 uppercase tracking-wider block mb-1">Effect</label>
              <select
                value={config.effect}
                onChange={(e) => setConfig({ ...config, effect: e.target.value as EffectType })}
                className="w-full h-8 rounded-md border border-white/10 bg-white/5 text-white text-xs px-2 focus:outline-none focus:border-[#F5C518]"
              >
                <option value="parallax">Parallax Scroll</option>
                <option value="zoom">Zoom on Scroll</option>
                <option value="fade">Fade on Scroll</option>
                <option value="tilt">Tilt on Hover</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-white/50 uppercase tracking-wider block mb-1">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.backgroundColor}
                  onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                />
                <span className="text-[10px] text-white/40 font-mono">{config.backgroundColor}</span>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {config.layers.map((layer, index) => (
              <LayerItem
                key={layer.id}
                layer={layer}
                index={index}
                total={config.layers.length}
                onUpdate={(patch) => updateLayer(layer.id, patch)}
                onRemove={() => removeLayer(layer.id)}
                onDuplicate={() => duplicateLayer(layer.id)}
                onMoveUp={() => moveLayer(layer.id, "up")}
                onMoveDown={() => moveLayer(layer.id, "down")}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-white/10">
          <Button
            size="sm"
            variant="outline"
            className="w-full h-8 text-xs gap-1.5 border-white/10 bg-white/5 hover:bg-white/10 text-white"
            onClick={addLayer}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Layer
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}

interface LayerItemProps {
  layer: ParallaxLayer
  index: number
  total: number
  onUpdate: (patch: Partial<ParallaxLayer>) => void
  onRemove: () => void
  onDuplicate: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function LayerItem({ layer, index: _index, total, onUpdate, onRemove, onDuplicate, onMoveUp: _onMoveUp, onMoveDown: _onMoveDown }: LayerItemProps) {
  return (
    <div className="group rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 hover:border-white/[0.12] transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <GripVertical className="h-3.5 w-3.5 text-white/20 shrink-0" />
        <div className="flex-1 min-w-0">
          <input
            value={layer.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full bg-transparent text-xs font-medium text-white/80 focus:outline-none truncate"
          />
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onUpdate({ visible: !layer.visible })}
                className="h-6 w-6 rounded flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>{layer.visible ? "Hide" : "Show"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onDuplicate}
                className="h-6 w-6 rounded flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <Copy className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Duplicate</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onRemove}
                disabled={total <= 1}
                className="h-6 w-6 rounded flex items-center justify-center hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors disabled:opacity-30"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Remove</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="space-y-1.5">
        <ImagePicker
          value={layer.imageUrl}
          onChange={(url) => onUpdate({ imageUrl: url })}
        />

        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <label className="text-[9px] text-white/40 uppercase tracking-wider block mb-0.5">Depth</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={layer.depth}
              onChange={(e) => onUpdate({ depth: Number(e.target.value) })}
              className="w-full accent-[#F5C518] h-0.5 rounded-full appearance-none bg-white/10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-[9px] text-white/40 uppercase tracking-wider block mb-0.5">Scale</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={layer.scale}
              onChange={(e) => onUpdate({ scale: Number(e.target.value) })}
              className="w-full accent-[#F5C518] h-0.5 rounded-full appearance-none bg-white/10 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <label className="text-[9px] text-white/40 uppercase tracking-wider block mb-0.5">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={layer.opacity}
              onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
              className="w-full accent-[#F5C518] h-0.5 rounded-full appearance-none bg-white/10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-[9px] text-white/40 uppercase tracking-wider block mb-0.5">Blend</label>
            <select
              value={layer.blendMode}
              onChange={(e) => onUpdate({ blendMode: e.target.value as BlendMode })}
              className="w-full h-6 rounded border border-white/10 bg-white/5 text-[10px] text-white/70 px-1 focus:outline-none focus:border-[#F5C518]"
            >
              {BLEND_MODES.map((bm) => (
                <option key={bm.value} value={bm.value}>{bm.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <label className="text-[9px] text-white/40 uppercase tracking-wider block mb-0.5">Offset X</label>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={layer.offsetX}
              onChange={(e) => onUpdate({ offsetX: Number(e.target.value) })}
              className="w-full accent-[#F5C518] h-0.5 rounded-full appearance-none bg-white/10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-[9px] text-white/40 uppercase tracking-wider block mb-0.5">Offset Y</label>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={layer.offsetY}
              onChange={(e) => onUpdate({ offsetY: Number(e.target.value) })}
              className="w-full accent-[#F5C518] h-0.5 rounded-full appearance-none bg-white/10 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
