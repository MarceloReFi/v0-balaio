import { createClient } from "@/lib/supabase/client"
import type { Task, TaskTemplate } from "@/lib/types"

export async function saveTaskTemplate(input: {
  creatorAddress: string
  name: string
  description?: string | null
  category?: Task["category"] | null
  complexity?: Task["complexity"] | null
  tags?: string[]
  allowPhotoProof?: boolean
  locationLat?: number | null
  locationLng?: number | null
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  const { error } = await supabase.from("task_templates").insert({
    creator_address: input.creatorAddress.toLowerCase(),
    name: input.name,
    description: input.description || null,
    category: input.category || null,
    complexity: input.complexity || null,
    tags: input.tags || [],
    allow_photo_proof: input.allowPhotoProof || false,
    location_lat: input.locationLat ?? null,
    location_lng: input.locationLng ?? null,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function listMyTaskTemplates(creatorAddress: string): Promise<TaskTemplate[]> {
  if (!creatorAddress) return []
  const supabase = createClient()
  const { data, error } = await supabase
    .from("task_templates")
    .select("*")
    .eq("creator_address", creatorAddress.toLowerCase())
    .order("created_at", { ascending: false })
  if (error || !data) return []
  return data.map((row: any) => ({
    id: row.id,
    creatorAddress: row.creator_address,
    name: row.name,
    description: row.description,
    category: row.category,
    complexity: row.complexity,
    tags: row.tags || [],
    allowPhotoProof: row.allow_photo_proof || false,
    locationLat: row.location_lat,
    locationLng: row.location_lng,
    createdAt: new Date(row.created_at),
  }))
}
