import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { id, improvedTitle } = await req.json()

  if (!id || !improvedTitle) {
    return NextResponse.json(
      { error: 'id and improvedTitle are required' },
      { status: 400 }
    )
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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
}
