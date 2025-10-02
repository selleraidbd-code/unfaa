"use client";

import { LandingPageDemo } from "@/types/landing-page-type";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
interface TemplateSelectableCardProps {
    template: LandingPageDemo;
    onSelect: (template: LandingPageDemo) => void;
}

export function TemplateSelectableCard({
    template,
    onSelect,
}: TemplateSelectableCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll images when hovering
    // useEffect(() => {
    //     if (isHovering && template.siteImageUrl) {
    //         // intervalRef.current = setInterval(() => {
    //         //     setCurrentImageIndex((prevIndex) =>
    //         //         prevIndex === template.templateUrl.length - 1
    //         //             ? 0
    //         //             : prevIndex + 1
    //         //     );
    //         // }, 2000);
    //     } else if (intervalRef.current) {
    //         clearInterval(intervalRef.current);
    //     }

    //     return () => {
    //         if (intervalRef.current) {
    //             clearInterval(intervalRef.current);
    //         }
    //     };
    // }, [isHovering, template.siteImageUrl]);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        // Reset to first image when not hovering
        setCurrentImageIndex(0);
    };

    return (
        <div
            className="group rounded-lg overflow-hidden border bg-card shadow-sm transition-all hover:shadow-md"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="aspect-video w-full overflow-hidden bg-muted relative">
                <Image
                    src={template.imgURL}
                    height={400}
                    width={600}
                    alt={template.name}
                />
                {/* {template.images.map((image, index) => (
                    <div
                        key={index}
                        className={cn(
                            "absolute inset-0 h-full w-full transition-opacity duration-500",
                            currentImageIndex === index
                                ? "opacity-100"
                                : "opacity-0"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`${template.name} preview ${index + 1}`}
                            width={600}
                            height={400}
                            className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                            priority={index === 0}
                        />
                    </div>
                ))} */}

                {/* Image indicators */}
                {/* {template.templateUrl && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                        {template.templateUrl.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "h-1.5 w-6 rounded-full transition-all",
                                    currentImageIndex === index
                                        ? "bg-primary"
                                        : "bg-primary/30"
                                )}
                            />
                        ))}
                    </div>
                )} */}
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    {/* <Badge
                        variant={template.isPublished ? "default" : "secondary"}
                        className="text-xs"
                    >
                        {template.isPublished ? "Published" : "Draft"}
                    </Badge> */}
                </div>

                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {template.keyword || "No description available"}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                        {template.theme}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link
                            href={`/site/${template.slug}`}
                            className="flex items-center gap-2"
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                        </Link>
                    </Button>
                    <Button size="sm" onClick={() => onSelect(template)}>
                        Use Template
                    </Button>
                </div>
            </div>
        </div>
    );
}
