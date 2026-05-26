"use client"

import { useState, useRef } from "react"
import { uploadParallaxImage } from "@/lib/parallax-upload"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Upload, Link2, Image as ImageIcon, X, Loader2 } from "lucide-react"

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
}

const BUILT_IN_IMAGES = [
  { src: "/img/parallax/sky.svg", label: "Sky" },
  { src: "/img/parallax/mountains-far.svg", label: "Mountains Far" },
  { src: "/img/parallax/mountains-near.svg", label: "Mountains Near" },
  { src: "/img/parallax/ground.svg", label: "Ground" },
  { src: "/img/parallax/trees.svg", label: "Trees" },
  { src: "/img/parallax/stars.svg", label: "Stars" },
  { src: "/img/parallax/nebula.svg", label: "Nebula" },
  { src: "/img/parallax/planet.svg", label: "Planet" },
  { src: "/img/parallax/city-sky.svg", label: "City Sky" },
  { src: "/img/parallax/buildings-far.svg", label: "Buildings Far" },
  { src: "/img/parallax/buildings-near.svg", label: "Buildings Near" },
  { src: "/img/parallax/street.svg", label: "Street" },
  { src: "/img/parallax/sunset-sky.svg", label: "Sunset Sky" },
  { src: "/img/parallax/sun.svg", label: "Sun" },
  { src: "/img/parallax/clouds.svg", label: "Clouds" },
  { src: "/img/parallax/ocean.svg", label: "Ocean" },
  { src: "/img/parallax/palms.svg", label: "Palms" },
  { src: "/img/parallax/sand.svg", label: "Sand" },
  { src: "/img/parallax/geo-bg.svg", label: "Geo BG" },
  { src: "/img/parallax/geo-shapes-1.svg", label: "Geo Shapes 1" },
  { src: "/img/parallax/geo-shapes-2.svg", label: "Geo Shapes 2" },
  { src: "/img/parallax/geo-shapes-3.svg", label: "Geo Shapes 3" },
  { src: "/img/parallax/water-surface.svg", label: "Water Surface" },
  { src: "/img/parallax/light-rays.svg", label: "Light Rays" },
  { src: "/img/parallax/fish-far.svg", label: "Fish Far" },
  { src: "/img/parallax/coral.svg", label: "Coral" },
  { src: "/img/parallax/fish-near.svg", label: "Fish Near" },
  { src: "/img/parallax/asteroids.svg", label: "Asteroids" },
  { src: "/img/parallax/space-debris.svg", label: "Space Debris" },
]

export default function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [tab, setTab] = useState<string>(
    value.startsWith("blob:") || value.includes("supabase") ? "upload" : "builtin"
  )
  const [urlInput, setUrlInput] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadParallaxImage(file)
    if (url) onChange(url)
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleUrl = () => {
    if (!urlInput.trim()) return
    onChange(urlInput.trim())
    setUrlInput("")
  }

  const isBuiltin = value.startsWith("/img/parallax/")

  return (
    <div>
      {value && (
        <div className="relative mb-1.5 rounded-md overflow-hidden border border-white/10 h-12 bg-white/[0.03]">
          <img
            src={value}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors"
          >
            <X className="h-3 w-3 text-white/70" />
          </button>
          {isBuiltin && (
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[8px] text-white/60 font-mono">
              Built-in
            </span>
          )}
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full h-7 bg-white/5 border border-white/10 p-0.5 gap-0">
          <TabsTrigger value="builtin" className="flex-1 h-full text-[10px] gap-1 data-[state=active]:bg-[#F5C518] data-[state=active]:text-black rounded">
            <ImageIcon className="h-3 w-3" />
            Built-in
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex-1 h-full text-[10px] gap-1 data-[state=active]:bg-[#F5C518] data-[state=active]:text-black rounded">
            <Upload className="h-3 w-3" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="flex-1 h-full text-[10px] gap-1 data-[state=active]:bg-[#F5C518] data-[state=active]:text-black rounded">
            <Link2 className="h-3 w-3" />
            URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builtin" className="mt-1">
          <div className="grid grid-cols-5 gap-1 max-h-28 overflow-y-auto scrollbar-hide">
            {BUILT_IN_IMAGES.map((img) => (
              <button
                key={img.src}
                onClick={() => onChange(img.src)}
                className={`relative aspect-[4/3] rounded overflow-hidden border transition-all ${
                  value === img.src
                    ? "border-[#F5C518] ring-1 ring-[#F5C518]/50"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[6px] text-white/70 text-center truncate px-0.5 py-0.5 font-mono">
                  {img.label}
                </span>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-1">
          <div className="flex items-center gap-1.5">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <Button
              size="sm"
              variant="outline"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="flex-1 h-7 text-[10px] gap-1 border-white/10 bg-white/5 hover:bg-white/10 text-white"
            >
              {uploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Upload className="h-3 w-3" />
              )}
              {uploading ? "Uploading..." : "Choose Image"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-1">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrl()}
              placeholder="https://..."
              className="flex-1 h-7 rounded border border-white/10 bg-white/5 px-2 text-[10px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#F5C518]"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleUrl}
              className="h-7 text-[10px] border-white/10 bg-white/5 hover:bg-white/10 text-white"
            >
              Set
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
