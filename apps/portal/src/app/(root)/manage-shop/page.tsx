import {
    Building2,
    CreditCard,
    FileText,
    LayoutPanelTop,
    Link as LinkIcon,
    MessageCircle,
    MessageSquare,
    Settings,
    Share2,
    Target,
    Truck,
} from "lucide-react";
import Link from "next/link";

const ManageShop = () => {
    const shopFeatures = [
        {
            icon: Settings,
            title: "Shop Settings",
            description:
                "General shop configurations customize your shop's core settings for a seamless experience.",
            slug: "shop-settings",
        },
        {
            icon: LayoutPanelTop,
            title: "Website Customization",
            description:
                "Customize your shop's appearance with themes, colors elements to create a unique and professional online presence.",
            slug: "website-customization",
        },
        {
            icon: LinkIcon,
            title: "Shop Domain",
            description:
                "Manage your shop's core configurations, including domain setup and general settings.",
            slug: "shop-domain",
        },
        {
            icon: FileText,
            title: "Shop Policy",
            description:
                "Define and customize policies for your shop, including returns, refunds, and customer service guidelines.",
            slug: "shop-policy",
        },
        {
            icon: CreditCard,
            title: "Delivery Charge",
            description:
                "Manage your shop's delivery settings to ensure smooth and efficient order fulfillment.",
            slug: "delivery-charge",
        },
        {
            icon: Truck,
            title: "Courier Integrations",
            description:
                "Integrate with courier services to streamline your delivery operations and expand your reach.",
            slug: "courier",
        },
        {
            icon: Building2,
            title: "Payment Gateway",
            description:
                "Integrate and manage payment options to provide customers with secure and flexible transaction methods.",
            slug: "payment-gateway",
        },
        {
            icon: Target,
            title: "SEO & Marketing Integrations",
            description:
                "Enhance your shop's visibility by connecting SEO tools and marketing integrations for better engagement.",
            slug: "seo-marketing",
        },
        {
            icon: MessageSquare,
            title: "SMS Support",
            description:
                "Enable SMS notifications and support to keep your customers informed with real-time updates.",
            slug: "sms-support",
        },
        {
            icon: MessageCircle,
            title: "Chat Support",
            description:
                "Provide instant communication and assistance to customers with chat support system.",
            slug: "chat-support",
        },
        {
            icon: Share2,
            title: "Social Links",
            description:
                "Connect your shop with social media platforms to enhance visibility and engagement.",
            slug: "social-links",
        },
    ];

    return (
        <>
            <div className="mb-8 space-y-1">
                <h1 className="title">Manage Shop</h1>
                <p className="text-gray-600">
                    Set up and customize your shop to ensure a smooth and
                    efficient experience.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopFeatures.map((feature) => {
                    const IconComponent = feature.icon;
                    return (
                        <Link
                            href={`/manage-shop/${feature.slug}`}
                            key={feature.slug}
                            className="card space-y-4 hover:shadow-md"
                        >
                            <div className="size-10 bg-primary/10 rounded-lg center">
                                <IconComponent className="size-5 text-primary" />
                            </div>

                            <div className="space-y-1">
                                <h2 className="sub-title text-lg">
                                    {feature.title}
                                </h2>

                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default ManageShop;
