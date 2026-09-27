// Resolves the public site URL and whether search engines may index this deployment.
// Indexing is opt-in: it requires a confirmed production URL and SITE_INDEXING=true,
// and is always off for Vercel preview/development deployments.

type Env = Record<string, string | undefined>;

function parseUrl(value: string | undefined): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

export function getSiteUrl(env: Env = process.env): URL | null {
  return parseUrl(env.NEXT_PUBLIC_SITE_URL);
}

export function isIndexingAllowed(env: Env = process.env): boolean {
  const vercelEnv = env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== "production") return false;
  return env.SITE_INDEXING === "true" && getSiteUrl(env)?.protocol === "https:";
}
