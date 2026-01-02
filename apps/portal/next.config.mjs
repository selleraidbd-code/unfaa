/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@workspace/ui"],
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "multi-media-server.naimurrhman.com",
            },
            {
                protocol: "https",
                hostname: "multi-media-server.naimurrhman.com",
            },
            {
                protocol: "https",
                hostname: "mediaserver.unfaa.com",
            },
            {
                protocol: "https",
                hostname: "buytiq.com",
            },
            {
                protocol: "https",
                hostname: "plus.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "example.com",
            },
            {
                protocol: "https",
                hostname: "evotechbd.info",
            },
            {
                protocol: "https",
                hostname: "i.ibb.co.com",
            },
        ],
    },
};

export default nextConfig;
