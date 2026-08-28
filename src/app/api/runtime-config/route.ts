import { getServerEnv } from '@/lib/config/env.server';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const { socketUrl } = getServerEnv();
  return Response.json({ socketUrl });
}
