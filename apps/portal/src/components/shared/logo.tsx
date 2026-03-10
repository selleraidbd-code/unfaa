import Image from "next/image";

import logo from "@/assets/icons/logo.svg";

type Props = {
    className?: string;
    size?: "sm" | "md" | "lg";
};

export const Logo = ({ className, size = "md" }: Props) => {
    const sizeMap = {
        sm: 120,
        md: 180,
        lg: 240,
    };

    return <Image src={logo} alt="Logo" width={sizeMap[size]} height={sizeMap[size]} className={className} />;
};
