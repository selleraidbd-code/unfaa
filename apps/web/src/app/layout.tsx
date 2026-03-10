import { Hind_Siliguri, Inter } from "next/font/google";

import "@workspace/ui/globals.css";
/* Swiper CSS imports */
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Providers } from "@/providers";

const fontSans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

const fontHindSiliguri = Hind_Siliguri({
    subsets: ["latin"],
    variable: "--font-hind-siliguri",
    weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${fontSans.variable} ${fontHindSiliguri.variable} font-sans antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
