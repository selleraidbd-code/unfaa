import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
    return (
        <section
            id="home"
            className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16"
        >
            <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                🚀 10x Faster Order Processing
                            </Badge>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Revolutionize
                                </span>{" "}
                                Your E-Commerce Operations
                            </h1>
                            <p className="text-lg text-gray-600 sm:text-xl">
                                Automate order management, inventory tracking,
                                and courier integration. Save 3-4 hours daily
                                with our intelligent automation system.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline">
                                Watch Demo
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-8 pt-4">
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    1000+
                                </div>
                                <div className="text-sm text-gray-600">
                                    Active Businesses
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    50K+
                                </div>
                                <div className="text-sm text-gray-600">
                                    Orders Processed
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    99.9%
                                </div>
                                <div className="text-sm text-gray-600">
                                    Uptime
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative lg:h-[500px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl transform rotate-3" />
                        <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                            <div className="space-y-4">
                                <div className="h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded w-3/4" />
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                                </div>
                                <div className="grid grid-cols-3 gap-4 pt-4">
                                    <div className="h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg" />
                                    <div className="h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg" />
                                    <div className="h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
