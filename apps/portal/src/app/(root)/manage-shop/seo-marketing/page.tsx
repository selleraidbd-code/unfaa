"use client";

import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import {
    ChevronDown,
    ChevronRight,
    Chrome,
    Copy,
    Facebook,
} from "lucide-react";

import { ArrowBackButton } from "@/components/ui/custom-back-button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";

const SeoMarketing = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [formData, setFormData] = useState({
        gtmId: "",
        pixelId: "",
        pixelAccessToken: "",
        pixelTestEventId: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <ArrowBackButton
                        href="/manage-shop"
                        className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 hover:border-blue-300 text-blue-600"
                    />
                    <h1 className="text-xl font-semibold">
                        SEO & Marketing Integrations
                    </h1>
                </div>

                {/* Marketing & SEO Tools Section */}
                <Card className="mb-4">
                    <CardHeader
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-medium">
                                Marketing & SEO Tools
                            </CardTitle>
                            {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                        </div>
                    </CardHeader>

                    {isExpanded && (
                        <CardContent className="space-y-6">
                            {/* Warning Alert */}
                            <Alert className="border-red-200 bg-red-50">
                                <AlertDescription className="text-red-600">
                                    To setup GTM or facebook pixel, please setup
                                    your shop domain first.
                                </AlertDescription>
                            </Alert>

                            {/* Sitemaps for Search Engine */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                                            <Chrome className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-medium">
                                                Sitemaps for Search Engine
                                            </CardTitle>
                                            <CardDescription className="text-sm">
                                                Add sitemaps to 'Google Search
                                                Console' to Rank your website.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                                        <code className="flex-1 text-sm font-mono">
                                            https://shop.zatiqeasy.com/api/120289/sitemaps.xml
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                copyToClipboard(
                                                    "https://shop.zatiqeasy.com/api/120289/sitemaps.xml"
                                                )
                                            }
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Facebook Data Feed */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Facebook className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-medium">
                                                Facebook Data Feed
                                            </CardTitle>
                                            <CardDescription className="text-sm">
                                                Add/Upload data feed to the
                                                Facebook catalog.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                                        <code className="flex-1 text-sm font-mono">
                                            https://shop.zatiqeasy.com/api/120289/facebook-product-feed.xml
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                copyToClipboard(
                                                    "https://shop.zatiqeasy.com/api/120289/facebook-product-feed.xml"
                                                )
                                            }
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Setup Google Tag Manager */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                                            <Chrome className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-medium">
                                                Setup Google Tag Manager
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="gtm-id"
                                            className="text-sm font-medium"
                                        >
                                            GTM ID
                                        </Label>
                                        <Input
                                            id="gtm-id"
                                            placeholder="GTM ID"
                                            value={formData.gtmId}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "gtmId",
                                                    e.target.value
                                                )
                                            }
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Setup Facebook Conversion API and Pixel */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Facebook className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-medium">
                                                Setup Facebook Conversion API
                                                and Pixel
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="pixel-id"
                                            className="text-sm font-medium"
                                        >
                                            Pixel ID
                                        </Label>
                                        <Input
                                            id="pixel-id"
                                            placeholder="Pixel ID"
                                            value={formData.pixelId}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "pixelId",
                                                    e.target.value
                                                )
                                            }
                                            className="bg-gray-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="pixel-access-token"
                                            className="text-sm font-medium"
                                        >
                                            Pixel Access Token
                                        </Label>
                                        <Input
                                            id="pixel-access-token"
                                            placeholder="Pixel Access Token"
                                            value={formData.pixelAccessToken}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "pixelAccessToken",
                                                    e.target.value
                                                )
                                            }
                                            className="bg-gray-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="pixel-test-event"
                                            className="text-sm font-medium"
                                        >
                                            Pixel Test Event Id{" "}
                                            <span className="text-gray-500 text-xs">
                                                (Just to test. Clear after
                                                testing is done)
                                            </span>
                                        </Label>
                                        <Input
                                            id="pixel-test-event"
                                            placeholder="Pixel Test Event Id"
                                            value={formData.pixelTestEventId}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "pixelTestEventId",
                                                    e.target.value
                                                )
                                            }
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Save Button */}
                            <div className="flex justify-end pt-4">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                                    Save
                                </Button>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default SeoMarketing;
