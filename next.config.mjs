/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // NOTE: output:"export", basePath, assetPrefix and images.unoptimized are
  // injected automatically by actions/configure-pages@v5 (with
  // `static_site_generator: next`) at build time on GitHub Pages — see
  // .github/workflows/nextjs.yml.  Keeping this config minimal so the
  // auto-inject doesn't conflict with locally-set values.  Local dev
  // (`npm run dev`) just runs in SSR mode at http://localhost:3000.
};

export default nextConfig;
