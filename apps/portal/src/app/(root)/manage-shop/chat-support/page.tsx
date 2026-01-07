"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Check } from "lucide-react";

import { ArrowBackButton } from "@/components/ui/custom-back-button";

const ChatSupport = () => {
    const [selectedOption, setSelectedOption] = useState<"none" | "facebook" | "whatsapp">("none");
    const [facebookPageId, setFacebookPageId] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");

    const handleFacebookClick = () => {
        setSelectedOption("facebook");
    };

    const handleWhatsappClick = () => {
        setSelectedOption("whatsapp");
    };

    const handleUpdateChatSupport = () => {
        // Handle form submission logic here
        console.warn("Updating chat support info...");
    };

    return (
        <div className="bg-gray-50">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <ArrowBackButton
                        href="/manage-shop"
                        className="border-blue-200 bg-blue-500/10 text-blue-600 hover:border-blue-300 hover:bg-blue-500/20"
                    />
                    <h1 className="text-xl font-semibold">Chat Support</h1>
                </div>

                {/* Main Card */}
                <Card className="w-full">
                    <CardContent className="p-6">
                        <h2 className="mb-6 text-lg font-medium text-gray-900">Chat Support</h2>

                        {/* Option Buttons */}
                        <div className="mb-6 flex gap-4">
                            <Button
                                variant={selectedOption === "facebook" ? "default" : "outline"}
                                className={`flex items-center gap-2 ${
                                    selectedOption === "facebook"
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "border-blue-600 text-blue-600 hover:bg-blue-50"
                                }`}
                                onClick={handleFacebookClick}
                            >
                                <Check className="h-4 w-4" />
                                Facebook
                            </Button>

                            <Button
                                variant={selectedOption === "whatsapp" ? "default" : "outline"}
                                className={`flex items-center gap-2 ${
                                    selectedOption === "whatsapp"
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "border-blue-600 text-blue-600 hover:bg-blue-50"
                                }`}
                                onClick={handleWhatsappClick}
                            >
                                <Check className="h-4 w-4" />
                                Whatsapp
                            </Button>
                        </div>

                        {/* Initial State */}
                        {selectedOption === "none" && (
                            <p className="mb-8 text-sm text-orange-600">
                                Select one of the chat options to setup chat support
                            </p>
                        )}

                        {/* Facebook Configuration */}
                        {selectedOption === "facebook" && (
                            <div className="space-y-6">
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <h3 className="mb-3 font-medium text-gray-900">Steps to enable Facebook Chat</h3>
                                    <div className="text-sm text-gray-700">
                                        <span className="font-medium">1. Get Page ID:</span> Go to your page → About →
                                        Page transparency and Copy the Page ID
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="facebook-page-id" className="text-sm font-medium text-gray-900">
                                        Facebook Page ID
                                    </Label>
                                    <Input
                                        id="facebook-page-id"
                                        placeholder="Facebook Page ID"
                                        value={facebookPageId}
                                        onChange={(e) => setFacebookPageId(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}

                        {/* WhatsApp Configuration */}
                        {selectedOption === "whatsapp" && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp-number" className="text-sm font-medium text-gray-900">
                                        Whatsapp number (Ex:- +8801**********)
                                    </Label>
                                    <Input
                                        id="whatsapp-number"
                                        placeholder="Whatsapp number (Ex:- +8801**********)"
                                        value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Update Button */}
                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={handleUpdateChatSupport}
                                className="bg-blue-600 px-6 text-white hover:bg-blue-700"
                            >
                                Update Chat Support Info
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ChatSupport;
