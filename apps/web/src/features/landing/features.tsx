import { Card, CardContent } from "@workspace/ui/components/card";
import { Clock, Zap, Users, Bot, Shield, MapPin } from "lucide-react";

export const Features = () => {
    const features = [
        {
            icon: Clock,
            title: "Time Efficiency",
            description:
                "Save 3-4 hours daily with automated order processing and management",
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            icon: Zap,
            title: "Fast Order Entry",
            description:
                "Process orders in seconds with intelligent auto-parsing from customer messages",
            color: "text-yellow-600",
            bg: "bg-yellow-100",
        },
        {
            icon: Users,
            title: "Team Management",
            description:
                "Manage efficiently with small teams through streamlined workflows",
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
        {
            icon: Bot,
            title: "Smart Automation",
            description:
                "Auto-parse customer details from messages and create orders instantly",
            color: "text-indigo-600",
            bg: "bg-indigo-100",
        },
        {
            icon: Shield,
            title: "Fraud Detection",
            description:
                "Built-in security checks to prevent duplicate orders and fraud",
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            icon: MapPin,
            title: "Live Tracking",
            description:
                "Real-time order updates and comprehensive tracking system",
            color: "text-red-600",
            bg: "bg-red-100",
        },
    ];

    return (
        <section id="features" className="py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Everything You Need to Scale Your Business
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Powerful features designed to automate your workflow and
                        boost productivity
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <CardContent className="p-6">
                                <div
                                    className={`${feature.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                                >
                                    <feature.icon
                                        className={`h-6 w-6 ${feature.color}`}
                                    />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
