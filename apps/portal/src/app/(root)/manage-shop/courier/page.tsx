"use client";

import { HeaderBackButton } from "@/components/ui/custom-back-button";
import useGetUser from "@/hooks/useGetUser";
import {
    useCreateCourierSetupMutation,
    useGetCourierSetupQuery,
} from "@/redux/api/couriar-api";
import { CourierCredentials, CourierType } from "@/types/courier-type";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { CustomTextCopy } from "@workspace/ui/components/custom/custom-text-copy";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "@workspace/ui/components/sonner";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
    AlertCircle,
    Check,
    Eye,
    EyeOff,
    Key,
    Lock,
    Package,
    Plane,
    Plus,
    Settings,
    Shield,
    Truck,
    User,
    Zap,
    Link2,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import steadfastLogo from "@/assets/images/steadfast.png";
import pathaoLogo from "@/assets/images/pathao.png";
import redxLogo from "@/assets/images/redx.png";
import paperflyLogo from "@/assets/images/paperfly.png";

interface CourierConfig {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description: string;
    fields: {
        key: string;
        label: string;
        type: "text" | "password";
        placeholder: string;
        required: boolean;
        icon: React.ComponentType<{ className?: string }>;
    }[];
}

const courierConfigs: Record<CourierType, CourierConfig> = {
    steadfast: {
        name: "SteadFast",
        icon: Truck,
        color: "bg-green-600",
        description: "Reliable delivery service with comprehensive tracking",
        fields: [
            {
                key: "steadFastAPIKey",
                label: "API Key",
                type: "password",
                placeholder: "Enter your API key",
                required: true,
                icon: Key,
            },
            {
                key: "steadFastAPISecret",
                label: "API Secret",
                type: "password",
                placeholder: "Enter your API secret",
                required: true,
                icon: Lock,
            },
        ],
    },
    pathao: {
        name: "Pathao",
        icon: Package,
        color: "bg-red-500",
        description: "Fast and efficient delivery across Bangladesh",
        fields: [
            {
                key: "storeId",
                label: "Store ID",
                type: "text",
                placeholder: "Enter store ID",
                required: true,
                icon: Settings,
            },
            {
                key: "clientId",
                label: "Client ID",
                type: "text",
                placeholder: "Enter client ID",
                required: true,
                icon: User,
            },
            {
                key: "clientSecret",
                label: "Client Secret",
                type: "password",
                placeholder: "Enter client secret",
                required: true,
                icon: Lock,
            },
        ],
    },
    redx: {
        name: "REDX",
        icon: Zap,
        color: "bg-black",
        description: "Express delivery service with real-time tracking",
        fields: [
            {
                key: "apiKey",
                label: "API Key",
                type: "password",
                placeholder: "Enter your API key",
                required: true,
                icon: Key,
            },
        ],
    },
    paperfly: {
        name: "PAPERFLY",
        icon: Plane,
        color: "bg-blue-500",
        description: "Nationwide delivery network with secure handling",
        fields: [
            {
                key: "username",
                label: "Username",
                type: "text",
                placeholder: "Enter username",
                required: true,
                icon: User,
            },
            {
                key: "password",
                label: "Password",
                type: "password",
                placeholder: "Enter password",
                required: true,
                icon: Lock,
            },
        ],
    },
};

// Logo mapping for courier services
const courierLogos: Record<CourierType, any> = {
    steadfast: steadfastLogo,
    pathao: pathaoLogo,
    redx: redxLogo,
    paperfly: paperflyLogo,
};

const DeliverySupport = () => {
    const [selectedCourier, setSelectedCourier] =
        useState<CourierType>("steadfast");
    const [credentials, setCredentials] = useState<CourierCredentials>({});
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
        {}
    );
    const [isLoading, setIsLoading] = useState(false);
    const user = useGetUser();
    const shopId = user?.shop?.id;
    const shopSlug = user?.shop?.slug;

    const {
        data: courierData,
        isLoading: isFetching,
        refetch,
    } = useGetCourierSetupQuery(
        { shopId: shopId || "" },
        {
            skip: !shopId,
        }
    );

    const [createCourierSetup] = useCreateCourierSetupMutation();

    useEffect(() => {
        if (courierData?.data) {
            const data = courierData.data;

            // Determine courier type based on available fields
            let courierType: CourierType = "steadfast"; // default
            if (data.steadFastAPIKey && data.steadFastAPISecret) {
                courierType = "steadfast";
            } else if (data.storeId && data.clientId && data.clientSecret) {
                courierType = "pathao";
            } else if (data.apiKey) {
                courierType = "redx";
            } else if (data.username && data.password) {
                courierType = "paperfly";
            }

            setSelectedCourier(courierType);

            // Map API response to credentials structure
            const mappedCredentials: CourierCredentials = {};
            if (courierType === "steadfast") {
                mappedCredentials.steadfast = {
                    steadFastAPIKey: data.steadFastAPIKey || "",
                    steadFastAPISecret: data.steadFastAPISecret || "",
                };
            } else if (courierType === "pathao") {
                mappedCredentials.pathao = {
                    storeId: data.storeId || "",
                    clientId: data.clientId || "",
                    clientSecret: data.clientSecret || "",
                };
            } else if (courierType === "redx") {
                mappedCredentials.redx = {
                    apiKey: data.apiKey || "",
                };
            } else if (courierType === "paperfly") {
                mappedCredentials.paperfly = {
                    username: data.username || "",
                    password: data.password || "",
                };
            }

            setCredentials(mappedCredentials);
        }
    }, [courierData]);

    const togglePasswordVisibility = (fieldKey: string) => {
        setShowPasswords((prev) => ({
            ...prev,
            [fieldKey]: !prev[fieldKey],
        }));
    };

    const handleCredentialChange = (
        courierType: CourierType,
        fieldKey: string,
        value: string
    ) => {
        setCredentials((prev) => ({
            ...prev,
            [courierType]: {
                ...prev[courierType],
                [fieldKey]: value,
            },
        }));
    };

    const validateCredentials = (courierType: CourierType): boolean => {
        const config = courierConfigs[courierType];
        let courierCreds: any = null;

        if (courierType === "steadfast") {
            courierCreds = credentials.steadfast;
        } else if (courierType === "pathao") {
            courierCreds = credentials.pathao;
        } else if (courierType === "redx") {
            courierCreds = credentials.redx;
        } else if (courierType === "paperfly") {
            courierCreds = credentials.paperfly;
        }

        if (!courierCreds) return false;

        return config.fields.every((field) => {
            const value = courierCreds[field.key] as string | undefined;
            return field.required ? value && value.trim() !== "" : true;
        });
    };

    const handleSaveCredentials = async () => {
        if (!shopId) {
            toast.error("Shop ID not found. Please try again.");
            return;
        }

        if (!validateCredentials(selectedCourier)) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsLoading(true);
        try {
            // Create payload based on selected courier type
            let payload: any = { shopId };

            if (selectedCourier === "steadfast") {
                const courierCreds = credentials.steadfast;
                if (courierCreds) {
                    payload = {
                        ...payload,
                        steadFastAPIKey: courierCreds.steadFastAPIKey,
                        steadFastAPISecret: courierCreds.steadFastAPISecret,
                    };
                }
            } else if (selectedCourier === "pathao") {
                const courierCreds = credentials.pathao;
                if (courierCreds) {
                    payload = {
                        ...payload,
                        storeId: courierCreds.storeId,
                        clientId: courierCreds.clientId,
                        clientSecret: courierCreds.clientSecret,
                    };
                }
            } else if (selectedCourier === "redx") {
                const courierCreds = credentials.redx;
                if (courierCreds) {
                    payload = {
                        ...payload,
                        apiKey: courierCreds.apiKey,
                    };
                }
            } else if (selectedCourier === "paperfly") {
                const courierCreds = credentials.paperfly;
                if (courierCreds) {
                    payload = {
                        ...payload,
                        username: courierCreds.username,
                        password: courierCreds.password,
                    };
                }
            }

            await createCourierSetup(payload).unwrap();
            toast.success(
                `${courierConfigs[selectedCourier].name} credentials ${
                    courierData?.data ? "updated" : "saved"
                } successfully`
            );

            refetch();
        } catch (error) {
            toast.error("Failed to save credentials. Please try again.");
            console.error("Error saving credentials:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentCourierType = (): CourierType | null => {
        if (!courierData?.data) return null;

        const data = courierData.data;
        if (data.steadFastAPIKey && data.steadFastAPISecret) return "steadfast";
        if (data.storeId && data.clientId && data.clientSecret) return "pathao";
        if (data.apiKey) return "redx";
        if (data.username && data.password) return "paperfly";
        return null;
    };

    const currentCourierType = getCurrentCourierType();

    const renderCourierConfig = (courierType: CourierType) => {
        const config = courierConfigs[courierType];
        let courierCreds: any = {};

        if (courierType === "steadfast") {
            courierCreds = credentials.steadfast || {};
        } else if (courierType === "pathao") {
            courierCreds = credentials.pathao || {};
        } else if (courierType === "redx") {
            courierCreds = credentials.redx || {};
        } else if (courierType === "paperfly") {
            courierCreds = credentials.paperfly || {};
        }

        return (
            <div className="space-y-6 max-w-5xl">
                {/* Service Header */}
                <div className="flex items-center gap-3">
                    <div
                        className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center`}
                    >
                        <config.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{config.name}</h2>
                        <p className="text-sm text-gray-600">
                            {config.description}
                        </p>
                    </div>
                </div>

                {/* Configuration Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <span>Configure {config.name}</span>
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            Enter your {config.name} credentials to enable
                            delivery services
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {config.fields.map((field) => (
                            <div key={field.key} className="space-y-2">
                                <Label
                                    htmlFor={field.key}
                                    className="text-sm font-medium flex items-center gap-2"
                                >
                                    <field.icon className="w-4 h-4 text-gray-500" />
                                    {field.label}{" "}
                                    {field.required && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id={field.key}
                                        type={
                                            field.type === "password" &&
                                            !showPasswords[field.key]
                                                ? "password"
                                                : "text"
                                        }
                                        placeholder={field.placeholder}
                                        value={courierCreds[field.key] || ""}
                                        onChange={(e) =>
                                            handleCredentialChange(
                                                courierType,
                                                field.key,
                                                e.target.value
                                            )
                                        }
                                        className="pr-10"
                                    />
                                    {field.type === "password" && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                                            onClick={() =>
                                                togglePasswordVisibility(
                                                    field.key
                                                )
                                            }
                                        >
                                            {showPasswords[field.key] ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Validation Error */}
                        {!validateCredentials(courierType) && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    Please fill in all required fields to save
                                    credentials.
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            onClick={handleSaveCredentials}
                            disabled={
                                !validateCredentials(courierType) || isLoading
                            }
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? (
                                "Saving..."
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    {courierData?.data ? "Update" : "Save"}{" "}
                                    Credentials
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    };

    if (isFetching || !shopId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {!shopId
                            ? "Loading shop information..."
                            : "Loading courier setup..."}
                    </p>
                </div>
            </div>
        );
    }

    const webhookUrl = shopSlug
        ? `https://server.unfaa.com/api/v1/webhook/stead-fast-webhook/${shopSlug}`
        : "";

    return (
        <div className="max-w-5xl space-y-6">
            <HeaderBackButton title="Delivery Support" href="/manage-shop" />

            {/* Webhook URL Section */}
            {shopSlug && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Link2 className="w-5 h-5 text-blue-600" />
                            <span>Webhook URL</span>
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            Copy this webhook URL and paste it in your merchant
                            dashboard to receive order updates
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Webhook URL
                            </Label>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <CustomTextCopy
                                    text={webhookUrl}
                                    copy={true}
                                    className="w-full"
                                    textClassName="text-sm font-mono break-all"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Current Setup Status */}
            {currentCourierType && (
                <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className=" text-green-800">
                        <strong>
                            {courierConfigs[currentCourierType].name}
                        </strong>{" "}
                        is currently configured and active.
                    </AlertDescription>
                </Alert>
            )}

            {/* Tabs Layout */}
            <Tabs
                value={selectedCourier}
                onValueChange={(value) =>
                    setSelectedCourier(value as CourierType)
                }
            >
                <TabsList className="grid w-full grid-cols-4">
                    {Object.entries(courierConfigs).map(([type, config]) => (
                        <TabsTrigger
                            key={type}
                            value={type}
                            className="flex items-center gap-2"
                        >
                            <config.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {config.name}
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.entries(courierConfigs).map(([type, config]) => (
                    <TabsContent key={type} value={type} className="mt-6">
                        {renderCourierConfig(type as CourierType)}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default DeliverySupport;
