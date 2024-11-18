/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'replicate.delivery',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'i.imgur.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  }
  
  module.exports = nextConfig;
  