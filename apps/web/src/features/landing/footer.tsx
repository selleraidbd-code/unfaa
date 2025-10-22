import { Mail, Phone, MapPinned } from "lucide-react";

export const Footer = () => {
    return (
        <footer id="contact" className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <div className="text-2xl font-bold text-white">
                            Unfaa
                        </div>
                        <p className="text-sm">
                            Revolutionizing e-commerce operations with
                            intelligent automation and seamless integrations.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">
                            Product
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#features"
                                    className="hover:text-white transition-colors"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#pricing"
                                    className="hover:text-white transition-colors"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    className="hover:text-white transition-colors"
                                >
                                    Testimonials
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">
                            Company
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#about"
                                    className="hover:text-white transition-colors"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#contact"
                                    className="hover:text-white transition-colors"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">
                            Contact
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <a
                                    href="mailto:support@storex.com.bd"
                                    className="hover:text-white transition-colors"
                                >
                                    support@storex.com.bd
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <a
                                    href="tel:+8801625269817"
                                    className="hover:text-white transition-colors"
                                >
                                    +880 1625-269817
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPinned className="h-4 w-4 mt-1" />
                                <span>Dhaka, Bangladesh</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
                    <p>&copy; 2025 Unfaa. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
