import Link from "next/link";
import { Section } from "@workspace/ui/landing/types.js";

type Props = {
    data?: Section;
};

export const Footer01 = ({ data }: Props) => {
    return (
        <footer className="w-full border-t bg-background py-6">
            <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
                <p className="text-center text-sm  text-primary md:text-left">
                    © {new Date().getFullYear()} {data?.title}. All rights
                    reserved.
                </p>
                <nav className="flex gap-4 sm:gap-6">
                    <Link
                        href="#"
                        className="text-sm text-gray-500 hover:underline"
                    >
                        Terms
                    </Link>
                    <Link
                        href="#"
                        className="text-sm text-gray-500 hover:underline"
                    >
                        Privacy
                    </Link>
                    <Link
                        href="#"
                        className="text-sm text-gray-500 hover:underline"
                    >
                        Cookies
                    </Link>
                </nav>
            </div>
        </footer>
    );
};
