/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["ipfs.io"],
        unoptimized: true
    }
}

module.exports = nextConfig
