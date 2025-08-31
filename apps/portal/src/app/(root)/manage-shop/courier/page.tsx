"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Plus } from "lucide-react";
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from "@workspace/ui/components/collapsible";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { Button } from "@workspace/ui/components/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { ArrowBackButton } from "@/components/ui/custom-back-button";

type CourierService = "main" | "pathao" | "steadfast" | "redx" | "paperfly";

const DeliverySupport = () => {
    const [currentView, setCurrentView] = useState<CourierService>("main");
    const [showPassword, setShowPassword] = useState(false);
    const [showClientSecret, setShowClientSecret] = useState(false);
    const [showAppSecret, setShowAppSecret] = useState(false);
    const [isDeliveryServiceOpen, setIsDeliveryServiceOpen] = useState(true);
    const [isIntegrateServicesOpen, setIsIntegrateServicesOpen] =
        useState(true);
    const [deliveryChargeRefundable, setDeliveryChargeRefundable] =
        useState(false);

    const renderMainView = () => (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <ArrowBackButton
                    href="/manage-shop"
                    className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 hover:border-blue-300 text-blue-600"
                />
                <h1 className="text-xl font-semibold">Delivery Support</h1>
            </div>

            {/* Hero Image */}
            <div className="w-full h-40 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800 mb-2">
                            Delivery Hobe
                        </div>
                        <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded inline-block">
                            মাত্র ৯৯ টাকায়
                        </div>
                    </div>
                    <div className="absolute right-4">
                        <div className="w-20 h-12 bg-yellow-400 rounded flex items-center justify-center">
                            <span className="text-black font-bold text-xs">
                                RX
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Service Section */}
            {/* <Collapsible
                open={isDeliveryServiceOpen}
                onOpenChange={setIsDeliveryServiceOpen}
            >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Delivery Service</span>
                    <span className="text-gray-400">⌄</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                    <div>
                        <Label
                            htmlFor="delivery-charge"
                            className="text-sm text-gray-600"
                        >
                            Delivery Charge (Default)
                        </Label>
                        <Input id="delivery-charge" className="mt-1" />
                        <p className="text-xs text-gray-500 mt-1">
                            Default delivery charge will be applied to all
                            areas, except for the specific zones listed below.
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-sm font-medium">
                                Delivery Charge not refundable?
                            </Label>
                            <p className="text-xs text-gray-500">
                                Enabling this option ensures if you return a
                                order the delivery charges will not be refunded.
                            </p>
                        </div>
                        <Switch
                            checked={deliveryChargeRefundable}
                            onCheckedChange={setDeliveryChargeRefundable}
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-medium mb-2 block">
                            Delivery options:
                        </Label>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                Cancel
                            </Button>
                            <Button variant="default" size="sm">
                                Delivery
                            </Button>
                            <Button variant="outline" size="sm">
                                STEADFAST
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Specific Delivery Charges
                        </Label>
                        <div className="flex gap-2">
                            <Select>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select delivery Zone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dhaka">Dhaka</SelectItem>
                                    <SelectItem value="chittagong">
                                        Chittagong
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Input placeholder="0" className="w-20" />
                            <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Add +
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                        >
                            Update Delivery Charges
                        </Button>
                    </div>
                </CollapsibleContent>
            </Collapsible> */}

            {/* Integrate Delivery Services */}
            {/* <Collapsible
                open={isIntegrateServicesOpen}
                onOpenChange={setIsIntegrateServicesOpen}
            >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">
                        Integrate Delivery Services
                    </span>
                    <span className="text-gray-400">⌄</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                    <Card className="border-blue-200 bg-blue-50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                                    <span className="text-black font-bold text-xs">
                                        RX
                                    </span>
                                </div>
                                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs">
                                    Recommended
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3">
                                <p className="text-sm">
                                    <strong>RX Courier</strong> | Please{" "}
                                    <span className="text-blue-600 underline">
                                        sign up
                                    </span>{" "}
                                    to get started. To get special service &
                                    discount use <strong>"ZATIO%RX"</strong>{" "}
                                    coupon code.
                                </p>

                                <div className="bg-white p-3 rounded border">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
                                            <span className="text-black font-bold text-xs">
                                                RX
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            Configure RxCourier
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-3">
                                        Please provide your RxCourier
                                        credentials to integrate RxCourier
                                    </p>

                                    <div className="space-y-3">
                                        <div className="relative">
                                            <Input
                                                placeholder="••••••••••••"
                                                type="password"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                placeholder="Password"
                                                type="password"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <Input placeholder="Store Id" />
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            Add +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div>
                        <h3 className="font-medium mb-3">
                            Other Courier Services:
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="h-12 justify-start gap-2 border-2 hover:border-red-300 bg-transparent"
                                onClick={() => setCurrentView("pathao")}
                            >
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        P
                                    </span>
                                </div>
                                <span className="text-sm">pathao</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-12 justify-start gap-2 border-2 hover:border-green-300 bg-transparent"
                                onClick={() => setCurrentView("steadfast")}
                            >
                                <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        S
                                    </span>
                                </div>
                                <span className="text-sm">SteadFast</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-12 justify-start gap-2 border-2 hover:border-black bg-transparent"
                                onClick={() => setCurrentView("redx")}
                            >
                                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        R
                                    </span>
                                </div>
                                <span className="text-sm font-bold">REDX</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-12 justify-start gap-2 border-2 hover:border-blue-300 bg-transparent"
                                onClick={() => setCurrentView("paperfly")}
                            >
                                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        P
                                    </span>
                                </div>
                                <span className="text-sm">PAPERFLY</span>
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible> */}
        </div>
    );

    const renderPathaoConfig = () => (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView("main")}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-medium">Delivery Support</h1>
            </div>

            {/* Other Courier Services */}
            <div>
                <h3 className="font-medium mb-3">Other Courier Services:</h3>
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="default"
                        className="h-12 justify-start gap-2 bg-red-500 hover:bg-red-600"
                    >
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <span className="text-red-500 text-xs font-bold">
                                P
                            </span>
                        </div>
                        <span className="text-sm text-white">pathao</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("steadfast")}
                    >
                        <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                S
                            </span>
                        </div>
                        <span className="text-sm">SteadFast</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("redx")}
                    >
                        <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                R
                            </span>
                        </div>
                        <span className="text-sm font-bold">REDX</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("paperfly")}
                    >
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                P
                            </span>
                        </div>
                        <span className="text-sm">PAPERFLY</span>
                    </Button>
                </div>
            </div>

            {/* Pathao Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                P
                            </span>
                        </div>
                        <span>Configure Pathao</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Please provide your Pathao credentials to integrate
                        Pathao
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="store-id">Store ID</Label>
                            <Input id="store-id" />
                        </div>
                        <div>
                            <Label htmlFor="client-id">Client ID</Label>
                            <Input id="client-id" />
                        </div>
                    </div>

                    <div className="relative">
                        <Label htmlFor="client-secret">Client Secret</Label>
                        <Input
                            id="client-secret"
                            type={showClientSecret ? "text" : "password"}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-8 h-6 w-6 p-0"
                            onClick={() =>
                                setShowClientSecret(!showClientSecret)
                            }
                        >
                            {showClientSecret ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </Button>
                    </div>

                    <div className="bg-gray-100 p-3 rounded">
                        <span className="text-sm">rana.cse6.bu@gmail.com</span>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    const renderSteadFastConfig = () => (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView("main")}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-medium">Delivery Support</h1>
            </div>

            {/* Other Courier Services */}
            <div>
                <h3 className="font-medium mb-3">Other Courier Services:</h3>
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("pathao")}
                    >
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                P
                            </span>
                        </div>
                        <span className="text-sm">pathao</span>
                    </Button>

                    <Button
                        variant="default"
                        className="h-12 justify-start gap-2 bg-green-600 hover:bg-green-700"
                    >
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                            <span className="text-green-600 text-xs font-bold">
                                S
                            </span>
                        </div>
                        <span className="text-sm text-white">SteadFast</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("redx")}
                    >
                        <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                R
                            </span>
                        </div>
                        <span className="text-sm font-bold">REDX</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("paperfly")}
                    >
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                P
                            </span>
                        </div>
                        <span className="text-sm">PAPERFLY</span>
                    </Button>
                </div>
            </div>

            {/* SteadFast Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                S
                            </span>
                        </div>
                        <span>Configure Steadfast</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Please provide your Steadfast credentials to integrate
                        Steadfast
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <Label htmlFor="api-key">API key</Label>
                            <Input id="api-key" />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-8 h-6 w-6 p-0"
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="relative">
                            <Label htmlFor="app-secret">App secret</Label>
                            <Input
                                id="app-secret"
                                type={showAppSecret ? "text" : "password"}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-8 h-6 w-6 p-0"
                                onClick={() => setShowAppSecret(!showAppSecret)}
                            >
                                {showAppSecret ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    const renderRedxConfig = () => (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView("main")}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-medium">Delivery Support</h1>
            </div>

            {/* Other Courier Services */}
            <div>
                <h3 className="font-medium mb-3">Other Courier Services:</h3>
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("pathao")}
                    >
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                P
                            </span>
                        </div>
                        <span className="text-sm">pathao</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("steadfast")}
                    >
                        <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                S
                            </span>
                        </div>
                        <span className="text-sm">SteadFast</span>
                    </Button>

                    <Button
                        variant="default"
                        className="h-12 justify-start gap-2 bg-black hover:bg-gray-800"
                    >
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                            <span className="text-black text-xs font-bold">
                                R
                            </span>
                        </div>
                        <span className="text-sm font-bold text-white">
                            REDX
                        </span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("paperfly")}
                    >
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                P
                            </span>
                        </div>
                        <span className="text-sm">PAPERFLY</span>
                    </Button>
                </div>
            </div>

            {/* REDX Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                R
                            </span>
                        </div>
                        <span>Configure Redx</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Please provide your Redx credentials to integrate Redx
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Label htmlFor="redx-api-key">API key</Label>
                        <Input id="redx-api-key" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-8 h-6 w-6 p-0"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    const renderPaperflyConfig = () => (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView("main")}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-medium">Delivery Support</h1>
            </div>

            {/* Other Courier Services */}
            <div>
                <h3 className="font-medium mb-3">Other Courier Services:</h3>
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("pathao")}
                    >
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                P
                            </span>
                        </div>
                        <span className="text-sm">pathao</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("steadfast")}
                    >
                        <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                S
                            </span>
                        </div>
                        <span className="text-sm">SteadFast</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-12 justify-start gap-2 border-2 bg-transparent"
                        onClick={() => setCurrentView("redx")}
                    >
                        <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                R
                            </span>
                        </div>
                        <span className="text-sm font-bold">REDX</span>
                    </Button>

                    <Button
                        variant="default"
                        className="h-12 justify-start gap-2 bg-blue-500 hover:bg-blue-600"
                    >
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                            <span className="text-blue-500 text-xs font-bold">
                                P
                            </span>
                        </div>
                        <span className="text-sm text-white">PAPERFLY</span>
                    </Button>
                </div>
            </div>

            {/* REDX Configuration (still showing) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                R
                            </span>
                        </div>
                        <span>Configure Redx</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Please provide your Redx credentials to integrate Redx
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Label htmlFor="redx-api-key-2">API key</Label>
                        <Input id="redx-api-key-2" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-8 h-6 w-6 p-0"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </CardContent>
            </Card>

            {/* Paperfly Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                P
                            </span>
                        </div>
                        <span>Configure Paperfly</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Please provide your Paperfly credentials to integrate
                        Paperfly
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <Input
                                placeholder="••••••••••••••••"
                                type={showPassword ? "text" : "password"}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        <div className="relative">
                            <Input placeholder="Password" type="password" />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    const renderCurrentView = () => {
        switch (currentView) {
            case "pathao":
                return renderPathaoConfig();
            case "steadfast":
                return renderSteadFastConfig();
            case "redx":
                return renderRedxConfig();
            case "paperfly":
                return renderPaperflyConfig();
            default:
                return renderMainView();
        }
    };

    return <div className="bg-white">{renderCurrentView()}</div>;
};

export default DeliverySupport;
