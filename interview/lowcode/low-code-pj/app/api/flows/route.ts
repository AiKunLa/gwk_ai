import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, nodes, edges } = body || {}
    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const { error } = await supabaseServer.from('flows').insert({ name, nodes, edges })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}


export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('flows')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // 非空结果错误
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 没有数据时返回空结构
    return NextResponse.json({
      name: data?.name || 'empty',
      nodes: data?.nodes || [],
      edges: data?.edges || []
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}


