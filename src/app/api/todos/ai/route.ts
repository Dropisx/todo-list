import { supabase } from '@/lib/supabase'
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

  const { error } = await supabase
    .from('todos')
    .update({ title: improvedTitle })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
