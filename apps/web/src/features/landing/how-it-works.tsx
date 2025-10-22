import { Card, CardContent } from "@workspace/ui/components/card";
import { Package, Bot, Zap, ArrowRight } from "lucide-react";

export const HowItWorks = () => {
    const steps = [
        {
            step: "01",
            title: "Copy Customer Message",
            description:
                "Simply copy the customer's message containing their name, phone, address, and product details",
            icon: Package,
        },
        {
            step: "02",
            title: "Paste & Auto-Parse",
            description:
                "Paste into our system and watch as AI automatically extracts all relevant information",
            icon: Bot,
        },
        {
            step: "03",
            title: "Order Created",
            description:
                "Order is instantly created in your courier system, ready for processing and delivery",
            icon: Zap,
        },
    ];

    return (
        <section className="py-20 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get started in minutes with our simple 3-step process
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    {steps.map((item, index) => (
                        <div key={index} className="relative">
                            <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-8">
                                    <div className="mb-6">
                                        <div className="text-6xl font-bold text-blue-100 mb-4">
                                            {item.step}
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                                            <item.icon className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                            {index < 2 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                    <ArrowRight className="h-8 w-8 text-blue-300" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
