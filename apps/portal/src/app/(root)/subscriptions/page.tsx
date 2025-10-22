import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Check, ArrowRight } from "lucide-react";

interface PricingPlan {
    name: string;
    originalPrice: number;
    price: number;
    savings: number;
    popular?: boolean;
    description?: string;
    features: string[];
}

const pricingPlans: PricingPlan[] = [
    {
        name: "Monthly Plan",
        originalPrice: 700,
        price: 500,
        savings: 200,
        features: [
            "Explore our 4 free subdomains",
            "Add your custom domain",
            "Free access to Zatiq Academy",
            "Integrated logistics and payment solutions",
            "Unlimited order and receipt processing",
            "Theme customization",
            "Track customer loyalty & customer list",
            "Enable alerts",
            "Dashboard",
            "Export reports",
        ],
    },
    {
        name: "3 Months Plan",
        originalPrice: 1500,
        price: 1200,
        savings: 300,
        popular: true,
        description: "Our most popular plan for small teams.",
        features: [
            "Explore our 4 free subdomains",
            "Add your custom domain",
            "Free access to Zatiq Academy",
            "Integrated logistics and payment solutions",
            "Unlimited order and receipt processing",
            "Theme customization",
            "Track customer loyalty & customer list",
            "Enable alerts",
            "Dashboard",
            "Export reports",
        ],
    },
    {
        name: "6 Months Plan",
        originalPrice: 3000,
        price: 2200,
        savings: 800,
        features: [
            "Explore our 4 free subdomains",
            "Add your custom domain",
            "Free access to Zatiq Academy",
            "Integrated logistics and payment solutions",
            "Unlimited order and receipt processing",
            "Theme customization",
            "Track customer loyalty & customer list",
            "Enable alerts",
            "Dashboard",
            "Export reports",
        ],
    },
    {
        name: "Yearly Plan",
        originalPrice: 6000,
        price: 4000,
        savings: 2000,
        popular: true,
        description: "Our most popular plan for small teams.",
        features: [
            "Explore our 4 free subdomains",
            "Add your custom domain",
            "Free access to Zatiq Academy",
            "Integrated logistics and payment solutions",
            "Unlimited order and receipt processing",
            "Theme customization",
            "Track customer loyalty & customer list",
            "Enable alerts",
            "Dashboard",
            "Export reports",
        ],
    },
];

const SubscriptionsPage = () => {
    return (
        <div className="mx-auto max-w-7xl px-4 py-12">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
                    Choose The Plan To Grow Your Business
                </h1>
                <p className="text-lg text-muted-foreground">
                    No hidden fees. Flexible pricing. Try any plan free for 3
                    days.
                </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {pricingPlans.map((plan) => (
                    <Card
                        key={plan.name}
                        className="relative flex flex-col bg-white transition-shadow hover:shadow-lg"
                    >
                        {/* Popular Badge */}
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <Badge className="bg-blue-50 text-blue-600 border-blue-200">
                                    Popular
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="space-y-4 pb-6">
                            <div>
                                <h3 className="text-xl font-bold">
                                    {plan.name}
                                </h3>
                                {plan.description && (
                                    <p className="mt-2 text-sm text-blue-600">
                                        {plan.description}
                                    </p>
                                )}
                            </div>

                            {/* Pricing */}
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground line-through">
                                    ৳{plan.originalPrice.toLocaleString()}
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">
                                        ৳{plan.price.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        save ৳{plan.savings.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="flex flex-1 flex-col space-y-6">
                            {/* Features */}
                            <div className="flex-1 space-y-3">
                                <h4 className="font-bold">FEATURES</h4>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex gap-3">
                                            <Check className="mt-0.5 size-5 shrink-0 text-green-600" />
                                            <span className="text-sm">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Get Started Button */}
                            <Button
                                className="w-full rounded-lg bg-blue-600 py-6 text-base font-medium hover:bg-blue-700"
                                size="lg"
                            >
                                Get started
                                <ArrowRight className="ml-2 size-5" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionsPage;
