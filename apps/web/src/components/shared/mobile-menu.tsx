"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@workspace/ui/components/sheet";

interface NavItem {
    label: string;
    href: string;
}

interface MobileMenuProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    navItems: NavItem[];
    onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export const MobileMenu = ({
    isOpen,
    onOpenChange,
    navItems,
    onNavClick,
}: MobileMenuProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <button
                onClick={() => onOpenChange(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
            >
                <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <SheetHeader className="px-6 py-6 border-b border-gray-200">
                    <SheetTitle className="text-left">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    U
                                </span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Unfaa
                            </span>
                        </div>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full px-6 py-6">
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => {
                                    onNavClick(e, item.href);
                                    onOpenChange(false);
                                }}
                                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 font-medium text-base px-3 py-3 rounded-lg cursor-pointer"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-200">
                        <Link
                            href="/auth/sign-in"
                            className="text-center text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm px-4 py-2.5 rounded-lg border border-gray-200 hover:border-blue-600"
                            onClick={() => onOpenChange(false)}
                        >
                            Log In
                        </Link>
                        <Link
                            href="/auth/sign-up"
                            className="text-center bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm shadow-sm"
                            onClick={() => onOpenChange(false)}
                        >
                            Create Your Store
                        </Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
