/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable this if it's causing the build to fail
    typedRoutes: false, 
  },
}

export default nextConfig;