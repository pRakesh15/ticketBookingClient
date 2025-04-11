// client/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // swcMinify: true,
    images: {
      domains: ['localhost'],
    },
    async rewrites() {
      return [
        {
          source: '/api/v1/:path*',
          destination: 'http://127.0.0.1:9898/api/v1/:path*', // Proxy to backend here we can make the  server proxy like instate of whole api we can call only api/vi/*
        },
        //here we can add multiple source and destination also
      ];
    },
  };
  
export default nextConfig;
  