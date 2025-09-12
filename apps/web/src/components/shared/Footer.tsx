import React from "react";
import Link from "next/link";

import {
    FaFacebook,
    FaFacebookMessenger,
    FaInstagram,
    FaTiktok,
    FaWhatsapp,
    FaYoutube,
} from "react-icons/fa";
import { Logo } from "@/components/shared/logo";

interface Footer7Props {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    sections?: Array<{
        title: string;
        links: Array<{ name: string; href: string }>;
    }>;
    description?: string;
    socialLinks?: Array<{
        icon: React.ReactElement;
        href: string;
        label: string;
    }>;
    copyright?: string;
    legalLinks?: Array<{
        name: string;
        href: string;
    }>;
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

const defaultSocialLinks = [
    {
        icon: <FaFacebook className="size-5 text-white lg:size-7" />,
        href: "https://www.facebook.com/profile.php?id=61577049317463",
        label: "Facebook",
    },
    {
        icon: <FaWhatsapp className="size-5 text-white lg:size-7" />,
        href: "https://wa.me/+8801776344646",
        label: "Whatsapp",
    },
    {
        icon: <FaYoutube className="size-5 text-white lg:size-7" />,
        href: "https://youtube.com/channel/UC9JIco9sWftdrc53FhS8zng?si=i6lsB6kVldG-Ic6N",
        label: "Youtube",
    },
    {
        icon: <FaFacebookMessenger className="size-5 text-white lg:size-7" />,
        href: "https://m.me/689072867619860?source=qr_link_share",
        label: "Messenger",
    },
    {
        icon: <FaInstagram className="size-5 text-white lg:size-7" />,
        href: "https://www.instagram.com/sahoz_bazar?igsh=MTdhd2p5Njhvb2lpZQ==",
        label: "Instagram",
    },
    {
        icon: <FaTiktok className="size-5 text-white lg:size-7" />,
        href: "https://www.tiktok.com/@sahoz.bazar?_t=ZS-8xHxBml80Cw&_r=1",
        label: "Tiktok",
    },
];

export const Footer = ({
    sections = defaultSections,
    description = "সহজ বাজার থেকে সকল প্রয়োজনীয় পণ্য অর্ডার করুন সহজেই",
    socialLinks = defaultSocialLinks,
    copyright = "Sahoz Bazar সর্বস্বত্ব সংরক্ষিত।",
}: Footer7Props) => {
    return (
        <section className="bg-zinc-800 pt-12">
            <div className="container">
                <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
                    <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
                        {/* Logo */}
                        <Logo domain="sahoz.bazar" />

                        <p className="max-w-[70%] text-sm text-gray-400">
                            {description}
                        </p>
                        <ul className="flex items-center space-x-6 text-muted-foreground">
                            {socialLinks.map((social, idx) => (
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
                            ))}
                        </ul>
                    </div>

                    <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:gap-20">
                        <div></div>
                        {sections.map((section, sectionIdx) => (
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
                                            <a href={link.href}>{link.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 border-t py-4 text-xs font-medium text-muted-foreground lg:text-sm">
                    <p className="text-center">
                        © {new Date().getFullYear()} {copyright}
                    </p>
                </div>
            </div>
        </section>
    );
};
