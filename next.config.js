/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    domains: [
      "flyontech-rental.s3.amazonaws.com",
      "s3.amazonaws.com",
      "s3.us-central-1.wasabisys.com",
      "flyontech-rental-product.s3.us-east-1.wasabisys.com",
      'flyontech-rental-productt.s3.us-east-1.wasabisys.com'
    ],
    
  },
};


const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(nextConfig)
