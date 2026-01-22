/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude Node.js specific modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@tensorflow/tfjs-node': false,
        'fs': false,
        'path': false,
        'crypto': false,
      }
      
      // Force Human library to use browser version
      config.resolve.alias = {
        ...config.resolve.alias,
        '@vladmandic/human': '@vladmandic/human/dist/human.esm.js',
      }
    }
    
    return config
  },
}

export default nextConfig
