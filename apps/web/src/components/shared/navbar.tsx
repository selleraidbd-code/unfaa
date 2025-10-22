"use client";

import Link from "next/link";
import { useState } from "react";
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

    const scrollToSection = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string
    ) => {
        e.preventDefault();
        const id = href.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
            const navHeight = 64; // Height of fixed navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.pageYOffset - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-sm border-b border-gray-200/20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                U
                            </span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Unfaa
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => scrollToSection(e, item.href)}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm cursor-pointer"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/auth/sign-in"
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-100/50"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/auth/sign-up"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm shadow-sm"
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
