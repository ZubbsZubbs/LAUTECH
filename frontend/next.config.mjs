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
        destination: 'https://lautech-edu-ng.onrender.com/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'https://lautech-edu-ng.onrender.com/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
