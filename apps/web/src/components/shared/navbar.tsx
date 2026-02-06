"use client";

import { useState } from "react";
import Link from "next/link";

import { MobileMenu } from "@/components/shared/mobile-menu";

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: "Home", href: "#home" },
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "About", href: "#about" },
        { label: "Contact", href: "#contact" },
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const id = href.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
            const navHeight = 64; // Height of fixed navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <nav className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200/20 bg-white/60 shadow-sm backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                            <span className="text-lg font-bold text-white">U</span>
                        </div>
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                            Unfaa
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-8 md:flex">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => scrollToSection(e, item.href)}
                                className="cursor-pointer text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden items-center space-x-4 md:flex">
                        <Link
                            href="https://portal.unfaa.com/auth/sign-in"
                            target="_blank"
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100/50 hover:text-blue-600"
                        >
                            Log In
                        </Link>
                        <Link
                            href="https://portal.unfaa.com/auth/sign-up"
                            target="_blank"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700"
                        >
                            Create Your Store
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <MobileMenu
                        isOpen={isMenuOpen}
                        onOpenChange={setIsMenuOpen}
                        navItems={navItems}
                        onNavClick={scrollToSection}
                    />
                </div>
            </div>
        </nav>
    );
};
