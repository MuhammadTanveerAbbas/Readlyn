"use client"

import { useEffect, useRef, useState } from "react"
import type { ParallaxConfig, ViewportMode } from "@/lib/parallax-types"
import { DEFAULT_CONFIG } from "@/lib/parallax-types"
import { PRESETS } from "@/lib/presets"
import ParallaxPreview from "@/components/parallax/ParallaxPreview"
import ConfigPanel from "@/components/parallax/ConfigPanel"
import ExportModal from "@/components/parallax/ExportModal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Code2, RotateCcw, Maximize, Minimize, Monitor, Tablet, Smartphone,
  Sparkles, Undo2, Redo2, Download, Upload, PanelLeftClose, PanelLeftOpen,
} from "lucide-react"

const STORAGE_KEY = "readlyn:parallax:v1"
const HISTORY_LIMIT = 50

export default function ParallaxStudioPage() {
  const [config, setConfigState] = useState<ParallaxConfig>(DEFAULT_CONFIG)
  const [viewport, setViewport] = useState<ViewportMode>("desktop")
  const [exportOpen, setExportOpen] = useState(false)
  const [cinemaMode, setCinemaMode] = useState(false)
  const [panelOpen, setPanelOpen] = useState(true)

  const historyRef = useRef<{ past: ParallaxConfig[]; future: ParallaxConfig[] }>({
    past: [],
    future: [],
  })
  const skipHistoryRef = useRef(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setConfigState(JSON.parse(saved))
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)) } catch {
      // Ignore localStorage errors
    }
  }, [config])

  const setConfig = (next: ParallaxConfig) => {
    if (!skipHistoryRef.current) {
      historyRef.current.past.push(config)
      if (historyRef.current.past.length > HISTORY_LIMIT) historyRef.current.past.shift()
      historyRef.current.future = []
    }
    skipHistoryRef.current = false
    setConfigState(next)
  }

  const undo = () => {
    const past = historyRef.current.past
    if (!past.length) return
    const prev = past.pop()!
    historyRef.current.future.push(config)
    skipHistoryRef.current = true
    setConfigState(prev)
  }

  const redo = () => {
    const fut = historyRef.current.future
    if (!fut.length) return
    const next = fut.pop()!
    historyRef.current.past.push(config)
    skipHistoryRef.current = true
    setConfigState(next)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault(); undo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
        e.preventDefault(); redo()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [config])

  const reset = () => {
    if (!confirm("Reset to default configuration?")) return
    setConfig(DEFAULT_CONFIG)
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "readlyn-parallax-config.json"; a.click()
    URL.revokeObjectURL(url)
  }

  const importJSON = () => {
    const input = document.createElement("input")
    input.type = "file"; input.accept = ".json,application/json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try { setConfig(JSON.parse(await file.text()) as ParallaxConfig) }
      catch { alert("Invalid JSON file.") }
    }
    input.click()
  }

  const viewportSizes: Record<ViewportMode, string> = {
    desktop: "w-full h-full",
    tablet: "w-[768px] h-[600px] max-w-full max-h-full",
    mobile: "w-[390px] h-[700px] max-w-full max-h-full",
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="h-screen w-screen flex flex-col bg-[var(--bg-base)] text-zinc-200 overflow-hidden font-sans">
        {/* HEADER */}
        <header className="h-12 border-b border-white/[0.07] flex items-center justify-between px-3 gap-2 flex-shrink-0 bg-[var(--bg-subtle)]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="leading-tight select-none">
              <div className="text-sm font-bold tracking-tighter text-white">
                Parallax Studio
              </div>
              <div className="text-[9px] text-white/40 uppercase tracking-[0.2em] hidden sm:block">
                Layer-based parallax tool
              </div>
            </div>

            <div className="hidden md:flex items-center gap-0.5 ml-2 border-l border-white/10 pl-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-white/60 hover:text-white" onClick={undo}>
                    <Undo2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-white/60 hover:text-white" onClick={redo}>
                    <Redo2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
              </Tooltip>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs text-white/60 hover:text-white hidden md:flex">
                  <Sparkles className="h-3.5 w-3.5" />
                  Presets
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 border-white/10 bg-[var(--bg-panel)] text-white">
                <DropdownMenuLabel className="text-white/60">Ready-made templates</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {PRESETS.map((p) => (
                  <DropdownMenuItem key={p.id} onClick={() => setConfig(p.config)} className="hover:bg-white/10 focus:bg-white/10">
                    <div className="flex flex-col">
                      <span className="font-medium text-xs text-white">{p.name}</span>
                      <span className="text-[10px] text-white/50">{p.description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex items-center gap-0.5 border border-white/10 rounded-md p-0.5 bg-white/[0.03]">
            <ViewportButton active={viewport === "desktop"} onClick={() => setViewport("desktop")} icon={<Monitor className="h-3.5 w-3.5" />} label="Desktop" />
            <ViewportButton active={viewport === "tablet"} onClick={() => setViewport("tablet")} icon={<Tablet className="h-3.5 w-3.5" />} label="Tablet" />
            <ViewportButton active={viewport === "mobile"} onClick={() => setViewport("mobile")} icon={<Smartphone className="h-3.5 w-3.5" />} label="Mobile" />
          </div>

          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-white/60 hover:text-white" onClick={() => setCinemaMode((c) => !c)}>
                  {cinemaMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cinema mode</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 text-xs border-white/10 bg-white/5 text-white/80 hover:bg-white/10 font-medium">
                  Session
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-white/10 bg-[var(--bg-panel)] text-white">
                <DropdownMenuItem onClick={exportJSON} className="hover:bg-white/10">
                  <Download className="h-3.5 w-3.5" />
                  Export JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={importJSON} className="hover:bg-white/10">
                  <Upload className="h-3.5 w-3.5" />
                  Import JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={reset} className="text-red-400 hover:bg-red-500/10">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium text-black bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-[0_0_20px_rgba(245,197,24,0.3)]"
              onClick={() => setExportOpen(true)}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export code</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 flex min-h-0 relative">
          {panelOpen && !cinemaMode && (
            <aside className="w-[300px] flex-shrink-0 border-r border-white/[0.06] bg-[var(--bg-subtle)] flex flex-col min-h-0 relative">
              <ConfigPanel config={config} setConfig={setConfig} />
              <button
                onClick={() => setPanelOpen(false)}
                className="absolute top-[30px] -right-5 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-[var(--bg-subtle)] border border-white/10 text-white/40 hover:text-white hover:bg-[var(--bg-panel)] flex items-center justify-center shadow-md transition-colors"
                aria-label="Close panel"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </aside>
          )}

          {!panelOpen && !cinemaMode && (
            <button
              onClick={() => setPanelOpen(true)}
              className="absolute left-0 top-[70px] z-30 h-9 w-9 rounded-r-xl bg-[var(--bg-subtle)] border border-l-0 border-white/10 text-white/40 hover:text-white hover:bg-[var(--bg-panel)] flex items-center justify-center shadow-lg transition-colors"
              aria-label="Open panel"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}

          <main className={`flex-1 min-w-0 bg-[var(--bg-base)] flex items-center justify-center ${cinemaMode ? "p-0" : "p-4"}`}>
            <div
              className={`relative overflow-hidden shadow-2xl transition-all duration-300 bg-[var(--bg-base)] ${
                cinemaMode
                  ? "rounded-none border-0 w-full h-full"
                  : `rounded-xl border border-white/10 ${viewportSizes[viewport]}`
              }`}
              style={viewport === "desktop" && !cinemaMode ? { aspectRatio: "16/9" } : undefined}
            >
              <ParallaxPreview
                config={config}
                cinemaMode={cinemaMode}
              />
            </div>
          </main>
        </div>

        <ExportModal open={exportOpen} onOpenChange={setExportOpen} config={config} />
      </div>
    </TooltipProvider>
  )
}

function ViewportButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`h-7 w-7 rounded inline-flex items-center justify-center transition-colors ${
            active
              ? "bg-[var(--bg-panel)] text-white shadow-sm"
              : "text-white/40 hover:text-white"
          }`}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
