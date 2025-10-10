import { config } from "@/config";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { ArrowRight, CheckCircle, Sparkles, Store } from "lucide-react";
import Link from "next/link";

export const ShopNotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                        <CheckCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        Congratulations! 🎉
                    </h1>
                    <p className="text-xl text-gray-600 max-w-lg mx-auto">
                        This domain is available and ready for your amazing
                        online store!
                    </p>
                </div>

                {/* Main Card */}
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center mb-4">
                            <CardTitle className="text-2xl text-gray-800">
                                Your Store Awaits
                            </CardTitle>
                        </div>
                        <CardDescription className="text-lg text-gray-600">
                            This domain is perfect for your business. Start
                            building your online presence today!
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Features List */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                <Sparkles className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    Professional Storefront
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    Mobile Responsive
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                                <Store className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    Easy Management
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                                <ArrowRight className="w-5 h-5 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    Quick Setup
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href={`${config.portalUrl}/auth/sign-up`}
                                target="_blank"
                                className="bg-gradient-to-r flex items-center gap-2 from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Create My Store
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                            {/* <Button
                                variant="outline"
                                size="lg"
                                className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold px-8 py-3 rounded-xl transition-all duration-300"
                            >
                                Learn More
                            </Button> */}
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Message */}
                <div className="text-center text-sm text-gray-500">
                    <p>
                        Join thousands of successful store owners who started
                        their journey with us
                    </p>
                </div>
            </div>
        </div>
    );
};
