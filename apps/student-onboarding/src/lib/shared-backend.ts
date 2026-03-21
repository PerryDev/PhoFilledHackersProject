const fallbackBackendUrl = "http://localhost:3000";

function sanitizeBaseUrl(input?: string) {
  const value = input?.trim();

  if (!value) {
    return fallbackBackendUrl;
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getSharedBackendConfig() {
  const baseUrl = sanitizeBaseUrl(process.env.NEXT_PUBLIC_SHARED_BACKEND_URL);
  const parsedUrl = new URL(baseUrl);

  return {
    baseUrl,
    hostLabel: parsedUrl.host,
    authUrl: new URL("/login", `${baseUrl}/`).toString(),
    dashboardUrl: new URL("/", `${baseUrl}/`).toString(),
    profileApiUrl: new URL("/api/profile", `${baseUrl}/`).toString(),
  };
}
