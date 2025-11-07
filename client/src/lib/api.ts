export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const envBase = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

  if (envBase) {
    return `${envBase}${normalizedPath}`;
  }

  if (typeof window !== "undefined") {
    const { origin, hostname, port } = window.location;

    if (hostname === "localhost" && port === "5173") {
      return `http://localhost:5000${normalizedPath}`;
    }

    return `${origin}${normalizedPath}`;
  }

  return normalizedPath;
}
