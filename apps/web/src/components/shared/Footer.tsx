import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { Shop } from "@/types/shop-type";
import {
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaTwitter,
    FaWhatsapp,
    FaYoutube,
} from "react-icons/fa";
import { getLink } from "@/lib/get-link";

interface FooterProps {
    shop: Shop;
}

const defaultSections = [
    {
        title: "Main Sections",
        links: [
            { name: "Home", href: "/" },
            { name: "Products", href: "/products" },
        ],
    },
    // {
    //     title: "Help & Support",
    //     links: [
    //         { name: "Contact Us", href: "/contact-us" },
    //         { name: "About Us", href: "/about-us" },
    //         { name: "FAQ", href: "/faq" },
    //     ],
    // },
    {
        title: "Legal Information",
        links: [
            { name: "Terms and Conditions", href: "/terms-conditions" },
            { name: "Privacy Policy", href: "/privacy-policy" },
            { name: "Return Policy", href: "/return-policy" },
            { name: "Refund Policy", href: "/refund-policy" },
        ],
    },
];

export const Footer = ({ shop }: FooterProps) => {
    const defaultSocialLinks = [
        {
            icon: <FaFacebook className="size-5 text-white lg:size-7" />,
            href: shop?.facebookLink,
            label: "Facebook",
        },
        {
            icon: <FaWhatsapp className="size-5 text-white lg:size-7" />,
            href: `https://wa.me/${shop?.whatsappNumber}`,
            label: "Whatsapp",
        },
        {
            icon: <FaYoutube className="size-5 text-white lg:size-7" />,
            href: shop?.youtubeLink,
            label: "Youtube",
        },
        {
            icon: <FaTwitter className="size-5 text-white lg:size-7" />,
            href: shop?.twitterLink,
            label: "Messenger",
        },
        {
            icon: <FaInstagram className="size-5 text-white lg:size-7" />,
            href: shop?.instagramLink,
            label: "Instagram",
        },
        {
            icon: <FaTiktok className="size-5 text-white lg:size-7" />,
            href: shop?.tiktokLink,
            label: "Tiktok",
        },
    ];
    return (
        <section className="bg-zinc-800 pt-12">
            <div className="container">
                <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
                    <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
                        {/* Logo */}
                        <Logo shopSlug={shop.slug} image={shop?.photoURL} />

                        <p className="max-w-[70%] text-sm text-muted line-clamp-3">
                            {shop?.description}
                        </p>
                        <ul className="flex items-center space-x-6 text-muted-foreground">
                            {defaultSocialLinks.map((social, idx) => {
                                if (!social.href) return null;
                                return (
                                    <li
                                        key={idx}
                                        className="font-medium hover:text-primary"
                                    >
                                        <Link
                                            href={social.href}
                                            target="_blank"
                                            aria-label={social.label}
                                        >
                                            {social.icon}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:gap-20">
                        <div></div>
                        {defaultSections.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-semibold text-gray-400">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3 text-sm text-white">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="font-medium hover:text-primary"
                                        >
                                            <Link
                                                href={getLink({
                                                    shopSlug: shop.slug,
                                                    path: link.href,
                                                })}
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 border-t py-4 text-xs font-medium text-muted-foreground lg:text-sm">
                    <p className="text-center">
                        © {new Date().getFullYear()} {shop?.name} All rights
                        reserved
                    </p>
                </div>
            </div>
        </section>
    );
};
