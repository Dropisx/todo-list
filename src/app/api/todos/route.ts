import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const user = searchParams.get('user')

  if (!user) {
    return NextResponse.json({ error: 'User not provided' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_identifier', user)
    .order('created_at')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { title, user } = body

  if (!title || !user) {
    return NextResponse.json(
      { error: 'Title and user are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('todos')
    .insert({
      title,
      user_identifier: user
    })
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }

  // 🔹 DISPARA O N8N (sem bloquear o usuário)
  fetch(process.env.N8N_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: data.id,
      title: data.title
    })
  }).catch(() => {
    // falha silenciosa — não afeta o usuário
  })

  return NextResponse.json(data)
}


export async function PUT(req: Request) {
  const body = await req.json()
  const { id, title, completed } = body

  if (!id) {
    return NextResponse.json(
      { error: 'Task id is required' },
      { status: 400 }
    )
  }

  const updates: any = {}

  if (title !== undefined) updates.title = title
  if (completed !== undefined) updates.completed = completed

  const { error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

