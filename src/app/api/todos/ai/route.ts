import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, improvedTitle } = body

    // Validação
    if (!id || !improvedTitle) {
      console.warn('[AI Route] Missing required fields:', { id, improvedTitle })
      return NextResponse.json(
        { error: 'id and improvedTitle are required' },
        { status: 400 }
      )
    }

    console.log('[AI Route] Atualizando título:', { id, improvedTitle })

    const { error, data } = await supabase
      .from('todos')
      .update({ 
        title: improvedTitle
      })
      .eq('id', id)

    if (error) {
      console.error('[AI Route] Erro ao atualizar:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[AI Route] Sucesso - Resposta do Supabase:', data)
    return NextResponse.json({ success: true, id, improvedTitle })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    console.error('[AI Route] Erro:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
