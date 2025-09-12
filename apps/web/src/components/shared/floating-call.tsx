import { Phone } from "lucide-react";
import Link from "next/link";

export const FloatingCall = ({ phoneNumber }: { phoneNumber?: string }) => {
    if (!phoneNumber) return null;
    return (
        <div className="fixed bottom-6 right-4 z-50">
            <Link target="_blank" href={`tel:${phoneNumber}`}>
                <div className="center pulse-wave size-16 rounded-full bg-primary">
                    <Phone className="size-9 text-primary-foreground" />
                </div>
            </Link>
        </div>
    );
};
