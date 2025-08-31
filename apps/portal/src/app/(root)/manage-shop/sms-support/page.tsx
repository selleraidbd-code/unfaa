import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Check, Plus } from "lucide-react";

const SmsSupport = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <HeaderBackButton title="SMS Support" href="/manage-shop" />

            {/* Main Content */}
            <Card>
                <CardContent className="p-6 space-y-8">
                    {/* SMS Service Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium text-gray-900">
                            SMS Service
                        </h2>
                        <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full">
                            <Check className="h-4 w-4 mr-2" />
                            Bulk SMS BD
                        </Badge>
                    </div>

                    {/* Configure BULK SMS BD Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Configure BULK SMS BD
                            </h3>
                            <p className="text-sm text-gray-600">
                                Create an account on{" "}
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline"
                                >
                                    BULK SMS BD
                                </a>{" "}
                                to obtain your credentials, and then integrate
                                those credentials into your service to enable
                                bulk SMS messaging functionality.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="api-key"
                                    className="text-sm font-medium"
                                >
                                    Api Key{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="api-key"
                                    placeholder="Api key"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="sender-id"
                                    className="text-sm font-medium"
                                >
                                    Sender ID{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="sender-id"
                                    placeholder="Sender ID"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                            </Button>
                        </div>
                    </div>

                    {/* Configure SMS Template Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-400">
                            Configure SMS Template
                        </h3>
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                            <p className="text-gray-500 text-sm">
                                Integrate a SMS service first
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SmsSupport;
