import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// POST - Save task metadata
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { task_id, title, description, category, complexity, validation_method, deadline, tags, creator_address } = body

    // Validate required fields
    if (!task_id || !title || !description || !category || !complexity || !validation_method || !creator_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from("tasks_metadata")
      .insert({
        task_id,
        title,
        description,
        category,
        complexity,
        validation_method,
        deadline: deadline || null,
        tags: tags || [],
        creator_address,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET - Fetch all tasks metadata
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("tasks_metadata")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
