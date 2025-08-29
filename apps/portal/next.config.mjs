/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@workspace/ui"],
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "multi-media-server.naimurrhman.com",
            },
        ],
    },
};

export default nextConfig;
