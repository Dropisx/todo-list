import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * GET — apenas para teste no navegador
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'API /api/todos/ai está funcionando',
  })
}

/**
 * POST — usado pelo n8n
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, improvedTitle } = body

    if (!id || !improvedTitle) {
      return NextResponse.json(
        { error: 'id and improvedTitle are required' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase env not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    )

    const { error } = await supabase
      .from('todos')
      .update({ title: improvedTitle })
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }
}
