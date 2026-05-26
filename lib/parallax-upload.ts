import { createClient } from "@/lib/supabase/client"

const BUCKET = "parallax-images"

export async function uploadParallaxImage(file: File): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const ext = file.name.split(".").pop() || "png"
  const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    console.error("[parallax-upload] upload failed:", error.message)
    return null
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath)

  return urlData?.publicUrl || null
}

export async function deleteParallaxImage(url: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const path = url.split(`${BUCKET}/`)[1]
  if (!path) return false

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path])

  if (error) {
    console.error("[parallax-upload] delete failed:", error.message)
    return false
  }
  return true
}

export async function listUserImages(): Promise<string[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(`${user.id}/`, {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    })

  if (error || !data) return []

  return data.map((file) => {
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(`${user.id}/${file.name}`)
    return urlData?.publicUrl || ""
  }).filter(Boolean)
}
