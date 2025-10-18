/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:9000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'https://localhost:9000/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
