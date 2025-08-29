import { ArrowBackButton } from "@/components/ui/custom-back-button";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Lock, Search } from "lucide-react";

const ShopDomain = () => {
    return (
        <div className="bg-gray-50">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <ArrowBackButton
                        href="/manage-shop"
                        className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 hover:border-blue-300 text-blue-600"
                    />
                    <h1 className="text-xl font-semibold">Shop Domain</h1>
                </div>

                {/* Shop Domains Section */}
                <Card>
                    <CardHeader className="pb-4">
                        <h2 className="text-lg font-medium">Shop Domains</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Filter Tags */}
                        <div className="flex flex-wrap gap-2">
                            <Badge className="bg-purple-600 hover:bg-purple-700">
                                Available
                            </Badge>
                            <Badge variant="secondary">Premium</Badge>
                            <Badge variant="secondary">Short</Badge>
                            <Badge variant="secondary">New TLD</Badge>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search domains..."
                                className="pl-10"
                            />
                        </div>

                        {/* Domain Listing */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-1">
                                    <div className="font-medium">
                                        example.com
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Available domain
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">
                                        $12.99/year
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Premium Feature Lock */}
                        <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
                            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="mb-4 rounded-full bg-purple-100 p-3">
                                    <Lock className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="mb-2 font-medium">
                                    Unlock Premium Domain Features
                                </h3>
                                <p className="mb-4 text-sm text-gray-600 max-w-md">
                                    Get access to premium domains, advanced
                                    search filters, domain suggestions, and
                                    priority support. Upgrade your plan to
                                    unlock these features.
                                </p>
                                <div className="mb-4 text-center">
                                    <p className="text-sm text-gray-500">
                                        To setup domain, upgrade your current
                                        plan
                                    </p>
                                </div>
                                <Button className="bg-purple-600 hover:bg-purple-700">
                                    Click Here to Subscribe
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Domain Categories */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-2">
                                        Popular TLDs
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>.com</span>
                                            <span className="text-gray-500">
                                                $12.99/year
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>.net</span>
                                            <span className="text-gray-500">
                                                $14.99/year
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>.org</span>
                                            <span className="text-gray-500">
                                                $13.99/year
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-2">
                                        New TLDs
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>.shop</span>
                                            <span className="text-gray-500">
                                                $39.99/year
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>.store</span>
                                            <span className="text-gray-500">
                                                $59.99/year
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>.online</span>
                                            <span className="text-gray-500">
                                                $39.99/year
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Domain Management Tools */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-blue-900">
                                            Domain Management Tools
                                        </h3>
                                        <p className="text-sm text-blue-700">
                                            Manage DNS, redirects, and more
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>

                {/* Footer Actions */}
                <div className="flex justify-end">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        Continue Setup
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShopDomain;
