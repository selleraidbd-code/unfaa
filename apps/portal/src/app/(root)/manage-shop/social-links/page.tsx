"use client";

import { ArrowBackButton } from "@repo/ui/components/CustomBackButton";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

const SocialMediaLinks = () => {
    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <ArrowBackButton
                        href="/manage-shop"
                        className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 hover:border-blue-300 text-blue-600"
                    />
                    <h1 className="text-xl font-semibold">Social Links</h1>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h2 className="text-lg font-medium mb-6">Social Links</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="facebook">Facebook</Label>
                                <Input
                                    id="facebook"
                                    type="url"
                                    placeholder="https://www.facebook.com/myshop"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <Input
                                    id="linkedin"
                                    type="url"
                                    placeholder="https://www.linkedin.com/myshop"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tiktok">Tiktok</Label>
                                <Input
                                    id="tiktok"
                                    type="url"
                                    placeholder="https://www.tiktok.com/myshop"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telegram">Telegram</Label>
                                <Input
                                    id="telegram"
                                    type="url"
                                    placeholder="https://www.telegram.com/myshop"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amazon">Amazon</Label>
                                <Input
                                    id="amazon"
                                    type="url"
                                    placeholder="https://www.amazon.com/myshop"
                                    className="h-11"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input
                                    id="instagram"
                                    type="url"
                                    placeholder="https://www.instagram.com/myshop"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="youtube">Youtube</Label>
                                <Input
                                    id="youtube"
                                    type="url"
                                    placeholder="https://www.youtube.com/myshop"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="discord">Discord</Label>
                                <Input
                                    id="discord"
                                    type="url"
                                    placeholder="https://www.discord.com/myshop"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="daraz">Daraz</Label>
                                <Input
                                    id="daraz"
                                    type="url"
                                    placeholder="https://www.daraz.com.bd/shop"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="walmart">Walmart</Label>
                                <Input
                                    id="walmart"
                                    type="url"
                                    placeholder="https://www.walmart.com/myshop"
                                    className="h-11"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        size="lg"
                    >
                        Update Social Links
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default SocialMediaLinks;
