/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Static export for GitHub Pages ─────────────────────────────────────
  // Produces a fully static `out/` directory — what the
  // `actions/upload-pages-artifact` step uploads.
  output: "export",

  // GitHub Pages can't run the Next.js image optimiser.
  images: { unoptimized: true },

  // Trailing slashes generate /path/index.html files which GH Pages serves
  // cleanly without any URL rewrite rules.
  trailingSlash: true,

  // basePath / assetPrefix are auto-injected at build time by
  // `actions/configure-pages@v5` based on the repo slug, so we don't hard-
  // code "/360_MV_project" here — that would break local `npm run dev`.
};

export default nextConfig;
