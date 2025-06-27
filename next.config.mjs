/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // or false if you want optimization
    domains: ["drive.google.com"], // ✅ Add this
  },
}

export default nextConfig
