import { createClient } from "@/lib/supabase/client"
import type { Organization, OrganizationMember, OrganizationRole, Project } from "@/lib/types"
import { taskStatusLabel, type TaskStatusLabel } from "@/lib/task-status"

function normalizeAddress(address: string): string {
  return address.trim().toLowerCase()
}

function rowToOrganization(row: any): Organization {
  return {
    id: row.id,
    ownerAddress: row.owner_address,
    name: row.name,
    description: row.description ?? null,
    logoUrl: row.logo_url ?? null,
    nature: row.nature ?? null,
    niches: row.niches ?? [],
    region: row.region ?? null,
    contactEmail: row.contact_email ?? null,
    socialLinks: row.social_links ?? {},
    isPublic: row.is_public ?? false,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

function rowToMember(row: any): OrganizationMember {
  return {
    id: row.id,
    organizationId: row.organization_id,
    walletAddress: row.wallet_address,
    role: row.role,
    createdAt: new Date(row.created_at),
  }
}

function rowToProject(row: any): Project {
  return {
    id: row.id,
    organizationId: row.organization_id,
    title: row.title,
    description: row.description ?? null,
    goals: row.goals ?? null,
    website: row.website ?? null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export async function createOrganization(input: {
  ownerAddress: string
  name: string
  description?: string
  logoUrl?: string
  nature?: string
  niches?: string[]
  region?: string
  contactEmail?: string
  socialLinks?: Record<string, string>
  isPublic?: boolean
}): Promise<Organization> {
  const supabase = createClient()
  const ownerAddress = normalizeAddress(input.ownerAddress)

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      owner_address: ownerAddress,
      name: input.name,
      description: input.description ?? null,
      logo_url: input.logoUrl ?? null,
      nature: input.nature ?? null,
      niches: input.niches ?? [],
      region: input.region ?? null,
      contact_email: input.contactEmail ?? null,
      social_links: input.socialLinks ?? {},
      is_public: input.isPublic ?? false,
    })
    .select()
    .single()

  if (error) throw error

  const { error: memberError } = await supabase.from("organization_members").insert({
    organization_id: data.id,
    wallet_address: ownerAddress,
    role: "owner",
  })

  if (memberError) throw memberError

  return rowToOrganization(data)
}

export async function getOrganization(id: string): Promise<Organization | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("organizations").select().eq("id", id).maybeSingle()

  if (error) throw error
  return data ? rowToOrganization(data) : null
}

export async function getOrganizationsByWallet(walletAddress: string): Promise<Organization[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("organization_members")
    .select("organizations(*)")
    .eq("wallet_address", normalizeAddress(walletAddress))

  if (error) throw error
  return (data ?? [])
    .map((row: any) => row.organizations)
    .filter(Boolean)
    .map(rowToOrganization)
}

export async function updateOrganization(
  id: string,
  patch: Partial<{
    name: string
    description: string | null
    logoUrl: string | null
    nature: string | null
    niches: string[]
    region: string | null
    contactEmail: string | null
    socialLinks: Record<string, string>
    isPublic: boolean
  }>
): Promise<Organization> {
  const supabase = createClient()

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (patch.name !== undefined) updates.name = patch.name
  if (patch.description !== undefined) updates.description = patch.description
  if (patch.logoUrl !== undefined) updates.logo_url = patch.logoUrl
  if (patch.nature !== undefined) updates.nature = patch.nature
  if (patch.niches !== undefined) updates.niches = patch.niches
  if (patch.region !== undefined) updates.region = patch.region
  if (patch.contactEmail !== undefined) updates.contact_email = patch.contactEmail
  if (patch.socialLinks !== undefined) updates.social_links = patch.socialLinks
  if (patch.isPublic !== undefined) updates.is_public = patch.isPublic

  const { data, error } = await supabase.from("organizations").update(updates).eq("id", id).select().single()

  if (error) throw error
  return rowToOrganization(data)
}

export async function deleteOrganization(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("organizations").delete().eq("id", id)
  if (error) throw error
}

export async function getPublicOrganizations(): Promise<Organization[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("organizations").select().eq("is_public", true).order("name")
  if (error) throw error
  return (data ?? []).map(rowToOrganization)
}

export async function getMembership(
  organizationId: string,
  walletAddress: string
): Promise<OrganizationRole | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("wallet_address", normalizeAddress(walletAddress))
    .maybeSingle()

  if (error) throw error
  return data ? (data.role as OrganizationRole) : null
}

export async function addOrganizationMember(
  organizationId: string,
  walletAddress: string,
  role: OrganizationRole
): Promise<OrganizationMember> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("organization_members")
    .insert({
      organization_id: organizationId,
      wallet_address: normalizeAddress(walletAddress),
      role,
    })
    .select()
    .single()

  if (error) throw error
  return rowToMember(data)
}

export async function removeOrganizationMember(organizationId: string, walletAddress: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("organization_members")
    .delete()
    .eq("organization_id", organizationId)
    .eq("wallet_address", normalizeAddress(walletAddress))

  if (error) throw error
}

export async function listOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("organization_members")
    .select()
    .eq("organization_id", organizationId)

  if (error) throw error
  return (data ?? []).map(rowToMember)
}

export async function createProject(input: {
  organizationId: string
  title: string
  description?: string
  goals?: string
  website?: string
}): Promise<Project> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("projects")
    .insert({
      organization_id: input.organizationId,
      title: input.title,
      description: input.description ?? null,
      goals: input.goals ?? null,
      website: input.website ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return rowToProject(data)
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("projects").select().eq("id", id).maybeSingle()

  if (error) throw error
  return data ? rowToProject(data) : null
}

export async function listProjectsByOrganization(organizationId: string): Promise<Project[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("projects").select().eq("organization_id", organizationId)

  if (error) throw error
  return (data ?? []).map(rowToProject)
}

export async function updateProject(
  id: string,
  patch: Partial<{
    title: string
    description: string | null
    goals: string | null
    website: string | null
  }>
): Promise<Project> {
  const supabase = createClient()

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (patch.title !== undefined) updates.title = patch.title
  if (patch.description !== undefined) updates.description = patch.description
  if (patch.goals !== undefined) updates.goals = patch.goals
  if (patch.website !== undefined) updates.website = patch.website

  const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single()

  if (error) throw error
  return rowToProject(data)
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) throw error
}

export interface ProjectTaskSummary {
  id: string
  title: string
  status: TaskStatusLabel
}

export async function listTasksByProject(projectId: string): Promise<ProjectTaskSummary[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("tasks").select("id, title, status").eq("project_id", projectId)
  if (error) throw error
  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title || row.id,
    status: taskStatusLabel(row.status),
  }))
}
