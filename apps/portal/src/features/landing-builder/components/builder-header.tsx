"use client";

import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";

type BuilderHeaderProps = {
    title: string;
    subtitle?: string;
    onBack: () => void;
};

export const BuilderHeader = ({ title, subtitle, onBack }: BuilderHeaderProps) => {
    return (
        <div className="flex items-center gap-2 lg:gap-3">
            <div className="bg-primary/10 rounded-full p-1 lg:p-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="h-9 w-9"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </div>
            <div>
                <h1 className="title lg:text-2xl">{title}</h1>
                {subtitle && (
                    <p className="text-muted-foreground text-sm max-sm:hidden">{subtitle}</p>
                )}
            </div>
        </div>
    );
};
