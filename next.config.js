/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  trailingSlash: true,
  images: {
    domains: [
      "s3.us-east-1.wasabisys.com",
      "rentbless-dev.s3.us-east-1.wasabisys.com",
      "rentbless-prod.s3.us-east-1.wasabisys.com",
    ],
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer(nextConfig);
