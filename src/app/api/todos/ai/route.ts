import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { id, improvedTitle } = body

  if (!id || !improvedTitle) {
    return NextResponse.json(
      { error: 'id and improvedTitle are required' },
      { status: 400 }
    )
  }

  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
