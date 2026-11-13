import 'server-only';

export type ServerEnv = {
  apiUrl: string;
  socketUrl: string;
};

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function getServerEnv(): ServerEnv {
  const apiUrl = process.env.API_URL?.trim();
  const socketUrl = process.env.SOCKET_URL?.trim();

  if (process.env.NODE_ENV === 'production' && (!apiUrl || !socketUrl)) {
    throw new Error('API_URL and SOCKET_URL are required in production.');
  }

  return {
    apiUrl: trimTrailingSlash(apiUrl || 'http://localhost:5000/api'),
    socketUrl: trimTrailingSlash(socketUrl || 'http://localhost:5000'),
  };
}
