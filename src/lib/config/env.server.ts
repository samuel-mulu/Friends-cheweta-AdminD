import 'server-only';

export type ServerEnv = {
  apiUrl: string;
  socketUrl: string;
};

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function getServerEnv(): ServerEnv {
  return {
    apiUrl: trimTrailingSlash(process.env.API_URL ?? 'http://localhost:5000/api'),
    socketUrl: trimTrailingSlash(process.env.SOCKET_URL ?? 'http://localhost:5000'),
  };
}
