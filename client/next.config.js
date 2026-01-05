/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ssr: false
  },
  trailingSlash: true,
  exportPathMap: function() {
    return {
      '/': { page: '/' }
    }
  }
}

module.exports = nextConfig