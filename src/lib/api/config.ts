/**
 * Single source of truth for where the API lives.
 *
 * Import `API_BASE_URL` instead of reading `import.meta.env` inline: a
 * hardcoded `http://localhost:5150` fallback scattered through the app is
 * invisible in development and silently breaks every deployed build.
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5150/api";

/** The server origin, i.e. the API base without its trailing `/api` path. */
export const API_ORIGIN: string = API_BASE_URL.replace(/\/api\/?$/, "");

/**
 * Resolves a server-relative asset path (avatars, product images) to a full
 * URL. Absolute URLs and empty values are passed through untouched.
 */
export const getAssetUrl = (path?: string | null): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  return `${API_ORIGIN}/${path.replace(/^\//, "")}`;
};
