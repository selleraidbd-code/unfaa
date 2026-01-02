"use client";

import { config } from "@/config";
import { AlertType } from "@/providers/AlertProvider";
import { useDeleteLandingPageMutation } from "@/redux/api/landing-page-api";
import { useAppSelector } from "@/redux/store/hook";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
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
        return `${config.rootDomain}/shop/${user?.shop?.slug}/${pageSlug}`;
    };

    const getLandingPageMode = (pageType: EPageType) => {
        if (pageType === EPageType.ADVANCED) {
            return "advanced";
        }
        if (pageType === EPageType.EASY_WITH_FAQ) {
            return "easy";
        }
        return null;
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

    return (
        <Card className="transition-shadow duration-200 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="sub-title line-clamp-2">{landingPage.name}</CardTitle>

                <CardDescription className="flex items-center gap-1 text-sm">
                    <Globe className="size-3" />/{landingPage.slug}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Calendar className="size-3" />
                    Created : {formatDateWithTime(landingPage.createdAt)}
                </div>
            </CardContent>

            <CardFooter className="grid grid-cols-2 gap-4">
                <CustomButton
                    variant="outline"
                    href={`/landing-page/builder?productId=${landingPage.productId}${getLandingPageMode(landingPage.pageType) ? `&mode=${getLandingPageMode(landingPage.pageType)}` : ""}`}
                    className="w-full"
                >
                    <Edit className="size-4" />
                    Edit Page
                </CustomButton>

                <CustomButton target="_blank" href={getLandingPageUrl(landingPage.slug)} className="w-full">
                    <ExternalLink className="size-4" />
                    View Page
                </CustomButton>

                <CustomButton
                    variant="destructive"
                    onClick={handleDelete}
                    className="col-span-2 w-full"
                    isLoading={isDeleting}
                    disabled={isDeleting}
                >
                    <Trash className="size-4" />
                    Delete Page
                </CustomButton>
            </CardFooter>
        </Card>
    );
};
