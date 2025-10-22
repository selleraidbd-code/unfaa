import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Check } from "lucide-react";

export const Pricing = () => {
    const plans = [
        {
            name: "Free Trial",
            price: "৳0",
            period: "5 days",
            description: "Perfect for testing our platform",
            features: [
                "30 orders per day",
                "Basic automation",
                "Email support",
                "All core features",
                "Mobile access",
            ],
            cta: "Start Free Trial",
            popular: false,
        },
        {
            name: "Standard",
            price: "৳100",
            period: "per month",
            description: "For growing businesses",
            features: [
                "30 orders per day",
                "Full automation",
                "Priority support",
                "Advanced analytics",
                "Courier integration",
                "Custom domain",
                "Landing page builder",
            ],
            cta: "Get Started",
            popular: true,
        },
        {
            name: "Premium",
            price: "৳200",
            period: "per month",
            description: "For established businesses",
            features: [
                "100 orders per day",
                "Full automation",
                "24/7 priority support",
                "Advanced analytics",
                "All integrations",
                "Custom domain",
                "Landing page builder",
                "White-label option",
                "API access",
            ],
            cta: "Get Started",
            popular: false,
        },
    ];

    return (
        <section id="pricing" className="py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose the plan that fits your business needs. Start
                        with a free trial.
                    </p>
                </div>
                <div className="grid gap-8 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative hover:shadow-2xl transition-all duration-300 ${
                                plan.popular
                                    ? "border-2 border-blue-500 scale-105"
                                    : ""
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-blue-600 text-white">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    {plan.name}
                                </CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">
                                        {plan.price}
                                    </span>
                                    <span className="text-gray-600 ml-2">
                                        / {plan.period}
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-2">
                                    {plan.description}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-3"
                                        >
                                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                                            <span className="text-gray-700">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className={`w-full ${
                                        plan.popular
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-gray-900 hover:bg-gray-800"
                                    }`}
                                    size="lg"
                                >
                                    {plan.cta}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
