import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Unfaa Store",
        short_name: "Unfaa",
        description:
            "Comprehensive e-commerce business solutions providing seamless online store management, inventory tracking, payment processing, and customer engagement tools for modern businesses",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0636FF",
        icons: [
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
