export type DataSource = 'mock' | 'api';

/**
 * DATA_SOURCE=mock is the management-demo path and does not call a network.
 * DATA_SOURCE=api uses EXPO_PUBLIC_API_BASE_URL with the placeholder client.
 * Switch back to mock at any time — including from Demo Controls at runtime.
 */
function readDataSource(): DataSource {
  return process.env.EXPO_PUBLIC_DATA_SOURCE === 'api' ? 'api' : 'mock';
}

const timeout = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 8000);

export const config = {
  dataSource: readDataSource(),
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
  apiTimeoutMs: Number.isFinite(timeout) && timeout > 0 ? timeout : 8000,
};
