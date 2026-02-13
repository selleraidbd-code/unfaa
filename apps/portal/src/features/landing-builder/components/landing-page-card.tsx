"use client";

import Link from "next/link";

import { config } from "@/config";
import { AlertType } from "@/providers/AlertProvider";
import { useDeleteLandingPageMutation } from "@/redux/api/landing-page-api";
import { useAppSelector } from "@/redux/store/hook";
import { toast } from "@workspace/ui/components/sonner";
import { EPageType } from "@workspace/ui/landing/types";
import { formatDateWithTime } from "@workspace/ui/lib/formateDate";
import { Calendar, Edit, ExternalLink, Globe, Trash } from "lucide-react";

import { LandingPage } from "@/types/landing-page-type";
import { useAlert } from "@/hooks/useAlert";
import { CustomButton } from "@/components/ui/custom-button";

interface LandingPageCardProps {
    landingPage: LandingPage;
}

export const LandingPageCard = ({ landingPage }: LandingPageCardProps) => {
    const user = useAppSelector((state) => state.auth.user);
    const { fire } = useAlert();
    const [deleteLandingPage, { isLoading: isDeleting }] = useDeleteLandingPageMutation();

    const getLandingPageUrl = (pageSlug: string) => {
        return `${config.rootDomain}/${user?.shop?.slug}/${pageSlug}`;
    };

    const handleDelete = () => {
        fire({
            title: "Delete Landing Page",
            description: `Are you sure you want to delete "${landingPage.name}"? This action cannot be undone.`,
            type: AlertType.ERROR,
            onConfirm: async () => {
                try {
                    await deleteLandingPage({ id: landingPage.id }).unwrap();
                    toast.success("Landing page deleted successfully");
                } catch (error) {
                    toast.error("Failed to delete landing page");
                }
            },
        });
    };

    const getLandingPageType = (pageType: EPageType) => {
        return pageType.includes("ADVANCED") ? "Advanced" : "Easy";
    };

    return (
        <Link
            href={getLandingPageUrl(landingPage.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card hover:border-primary/50 relative flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg"
        >
            {/* Header Section */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                        <h3 className="group-hover:text-primary line-clamp-2 text-lg leading-tight font-semibold transition-colors">
                            {landingPage.name}
                        </h3>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Globe className="size-3.5 flex-shrink-0" />
                            <span className="truncate font-medium">/{landingPage.slug}</span>
                        </div>
                    </div>

                    {/* Page Type Badge */}
                    <div className="flex-shrink-0">
                        <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold">
                            {getLandingPageType(landingPage.pageType)}
                        </span>
                    </div>
                </div>

                {/* Metadata */}
                <div className="text-muted-foreground mt-3 flex items-center gap-2 pt-2 text-xs">
                    <Calendar className="size-3.5 flex-shrink-0" />
                    <span>{formatDateWithTime(landingPage.createdAt)}</span>
                </div>
            </div>

            {/* Actions Footer - All buttons in one line */}
            <div className="bg-muted/20 grid grid-cols-3 gap-2 border-t p-3">
                <CustomButton
                    variant="destructiveOutline"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete();
                    }}
                    isLoading={isDeleting}
                    disabled={isDeleting}
                    className="w-full"
                >
                    <Trash className="size-4" />
                    Delete
                </CustomButton>
                <div onClick={(e) => e.stopPropagation()}>
                    <CustomButton
                        variant="outline"
                        href={`/landing-page/builder?productId=${landingPage.productId}&mode=${landingPage.pageType}`}
                        className="w-full"
                    >
                        <Edit className="size-4" />
                        Edit
                    </CustomButton>
                </div>

                <CustomButton target="_blank" href={getLandingPageUrl(landingPage.slug)} className="w-full">
                    <ExternalLink className="size-4" />
                    Preview
                </CustomButton>
            </div>
        </Link>
    );
};
