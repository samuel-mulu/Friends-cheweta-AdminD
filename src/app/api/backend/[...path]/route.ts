import { NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@/lib/config/env.server';

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { path } = await context.params;
  const { apiUrl } = getServerEnv();
  const target = `${apiUrl}/${path.join('/')}${request.nextUrl.search}`;

  const headers = new Headers();
  headers.set('accept', 'application/json');

  const authorization = request.headers.get('authorization');
  if (authorization) headers.set('authorization', authorization);

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
  });

  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get('content-type');
  if (upstreamContentType) responseHeaders.set('content-type', upstreamContentType);

  if (upstream.status === 204) {
    return new NextResponse(null, { status: 204, headers: responseHeaders });
  }

  const payload = await upstream.arrayBuffer();
  return new NextResponse(payload, { status: upstream.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
