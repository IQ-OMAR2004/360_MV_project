/** @type {import('next').NextConfig} */

// On GitHub Actions, GITHUB_REPOSITORY is "<owner>/<name>".
// We derive the GH-Pages sub-path from the repo name so basePath matches
// "https://<owner>.github.io/<name>/" automatically.
//   Local `npm run dev` / `npm run build`        → basePath ""
//   `actions/configure-pages` build (auto-inject) → basePath "/<name>"
//   Manual override                              → NEXT_PUBLIC_BASE_PATH=...
const repoName =
  (process.env.GITHUB_REPOSITORY || "").split("/")[1] || "";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.GITHUB_ACTIONS === "true" && repoName ? `/${repoName}` : "");

const nextConfig = {
  reactStrictMode: true,

  // ── Static export for GitHub Pages ─────────────────────────────────────
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,

  // ── Sub-path for GitHub Pages (preserves localhost dev) ────────────────
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
