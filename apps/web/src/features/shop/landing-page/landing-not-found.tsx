import Link from "next/link";

import { config } from "@/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ArrowRight, CheckCircle, FileText, Sparkles } from "lucide-react";

type Props = {
    slug: string;
};

export const LandingNotFound = ({ slug }: Props) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header Section */}
                <div className="space-y-4 text-center">
                    <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                        <FileText className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Landing Page Not Found</h1>
                    <p className="mx-auto max-w-lg text-xl text-gray-600">
                        This URL is available for you! You can create a beautiful landing page with this slug.
                    </p>
                </div>

                {/* Main Card */}
                <Card className="border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
                    <CardHeader className="pb-4 text-center">
                        <div className="mb-4 flex items-center justify-center">
                            <CardTitle className="text-2xl text-gray-800">Create Your Landing Page</CardTitle>
                        </div>
                        <CardDescription className="text-lg text-gray-600">
                            The slug{" "}
                            <span className="rounded bg-blue-50 px-2 py-1 font-mono font-semibold text-blue-600">
                                {slug}
                            </span>{" "}
                            is ready for your landing page. Start building today!
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Features List */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-center space-x-3 rounded-lg bg-green-50 p-3">
                                <Sparkles className="h-5 w-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">Custom Design</span>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg bg-blue-50 p-3">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Easy Builder</span>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg bg-purple-50 p-3">
                                <FileText className="h-5 w-5 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">Professional Layout</span>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg bg-orange-50 p-3">
                                <ArrowRight className="h-5 w-5 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">Quick Setup</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col justify-center gap-3 sm:flex-row">
                            <Link
                                href={`${config.portalUrl}/landing-page`}
                                target="_blank"
                                className="flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                            >
                                Create Landing Page
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Message */}
                <div className="text-center text-sm text-gray-500">
                    <p>Build beautiful landing pages that convert visitors into customers</p>
                </div>
            </div>
        </div>
    );
};
