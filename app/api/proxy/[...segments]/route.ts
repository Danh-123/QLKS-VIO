import { NextResponse } from 'next/server'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')

type RouteContext = {
  params: Promise<{ segments?: string[] }>
}

async function handler(request: Request, context: RouteContext) {
  const { segments: segmentsMaybe } = await context.params
  const segments = Array.isArray(segmentsMaybe) ? segmentsMaybe : []
  const path = segments.join('/')
  const url = new URL(path, API_BASE_URL ? `${API_BASE_URL}/` : 'http://localhost')
  url.search = new URL(request.url).search

  const headers: Record<string, string> = {}
  // copy common headers except host
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'host') return
    headers[key] = value
  })

  const init: RequestInit = {
    method: request.method,
    headers,
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      const body = await request.text()
      if (body) init.body = body
    } catch {
      // ignore
    }
  }

  try {
    const res = await fetch(url.toString(), init)
    const contentType = res.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const body = isJson ? await res.json() : await res.text()

    const response = NextResponse.json(body, { status: res.status })
    // forward some headers
    const ct = res.headers.get('content-type')
    if (ct) response.headers.set('content-type', ct)
    return response
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upstream request failed'
    return NextResponse.json({ message }, { status: 502 })
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler