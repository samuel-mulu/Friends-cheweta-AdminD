export const CLIENT_API_BASE = '/api/backend';

export type RuntimeClientConfig = {
  socketUrl: string;
};

let runtimeConfigPromise: Promise<RuntimeClientConfig> | null = null;

export function getRuntimeClientConfig(): Promise<RuntimeClientConfig> {
  if (!runtimeConfigPromise) {
    runtimeConfigPromise = fetch('/api/runtime-config', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Could not load runtime client config.');
        }
        return response.json() as Promise<RuntimeClientConfig>;
      })
      .catch((error) => {
        runtimeConfigPromise = null;
        throw error;
      });
  }
  return runtimeConfigPromise;
}
