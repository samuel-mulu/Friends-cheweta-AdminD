import { getServerEnv } from '@/lib/config/env.server';

export const dynamic = 'force-dynamic';

export function GET(): Response {
  getServerEnv();
  return Response.json({ status: 'ok' });
}
