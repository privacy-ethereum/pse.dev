import nextMdx from "@next/mdx"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})


/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx", "md"],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Static asset caching headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        source: "/favicon.(ico|svg|png)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*\\.(css|js|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/proxy-matomo",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control", 
            value: "public, max-age=86400, s-maxage=86400, must-revalidate",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/:path*\\.(jpg|jpeg|png|gif|webp|svg|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/articles/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
  // Configure compiler for modern browsers
  compiler: {
    // Remove React DevTools in production
    // eslint-disable-next-line no-undef
    removeConsole: process.env.NODE_ENV === "production",
    // Enable modern features
    emotion: false, // Disable if not using emotion
    styledComponents: false, // Disable if not using styled-components
  },
  experimental: {
    optimizePackageImports: [
      "@heroicons/react",
      "lucide-react",
      "framer-motion",
      "react-slick",
    ],
    // Use modern compilation target
    esmExternals: true,
    // Enable more aggressive optimizations for modern browsers
    serverComponentsExternalPackages: [],
  },
  // Enable SWC with modern target
  swcMinify: true,

  // Optimize runtime chunk size
  webpack: (config, { isServer, dev }) => {
    // Ensure TS path alias '@/*' resolves at build-time (esp. on Vercel/Linux)
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
    }

    if (isServer) {
      config.externals.push("erlpack")
    }

    // Optimize for modern browsers - reduce polyfills and transpilation
    if (!isServer && !dev) {
      // Reduce bundle size by excluding unnecessary polyfills (Vercel-safe)
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
      }

      // Enable optimization for modern browsers (Vercel-compatible)
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        // Modern module concatenation
        concatenateModules: true,
        // Optimize for production builds
        minimize: true,
        // Split CSS into smaller chunks
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            styles: {
              name: "styles",
              type: "css/extract-css",
              chunks: "all",
              enforce: true,
            },
          },
        },
      }
    }

    return config
  },
}

export default withMDX(nextConfig)
