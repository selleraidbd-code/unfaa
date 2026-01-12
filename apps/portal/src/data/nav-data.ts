import { UserRole } from "@/types";
import {
    ArrowDown,
    Bot,
    CirclePlay,
    Component,
    Crown,
    Folder,
    LayoutDashboard,
    MessageSquare,
    MonitorUp,
    Package,
    PanelTop,
    Pocket,
    ShieldPlus,
    ShoppingBag,
    ShoppingCart,
    Store,
    Truck,
    Users,
} from "lucide-react";

export const getNavData = (role: UserRole) => {
    if (role === UserRole.SUPER_ADMIN) {
        return {
            navItems: SuperAdminNavData,
        };
    } else if (role === UserRole.SELLER) {
        return {
            navItems: SellerNavData,
        };
    } else if (role === UserRole.USER) {
        return {
            navItems: UserNavData,
        };
    } else {
        return {
            navItems: [],
        };
    }
};

export const SuperAdminNavData = [
    {
        label: "",
        items: [
            {
                title: "Dashboard",
                url: "/",
                icon: LayoutDashboard,
            },
            {
                title: "Shops",
                url: "/shops",
                icon: Store,
            },
            {
                title: "Users",
                url: "/users",
                icon: Users,
            },
            {
                title: "Components",
                url: "/components",
                icon: Component,
            },
            {
                title: "Templates",
                url: "/templates",
                icon: PanelTop,
            },
            {
                title: "Manage Courses",
                url: "/manage-courses",
                icon: MonitorUp,
            },
            {
                title: "Manage Tickets",
                url: "/manage-ticket",
                icon: MessageSquare,
            },
        ],
    },
];

const SellerNavData = [
    {
        label: "",
        items: [
            {
                title: "Dashboard",
                url: "/",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: "Manage Order",
        items: [
            {
                title: "AI Order",
                url: "/ai-order",
                icon: Bot,
            },
            // {
            //     title: "Manual Order",
            //     url: "/make-order",
            //     icon: ClipboardPlus,
            // },
            {
                title: "Orders",
                url: "/orders",
                icon: ShoppingCart,
            },
            {
                title: "In Delivery",
                url: "/delivery-orders",
                icon: Truck,
            },
            {
                title: "Customers",
                url: "/customers",
                icon: Users,
            },
        ],
    },
    {
        label: "Manage Products",
        items: [
            {
                title: "Products",
                url: "/products",
                icon: ShoppingBag,
            },
            {
                title: "Categories",
                url: "/categories",
                icon: Package,
            },
            {
                title: "Brands",
                url: "/brands",
                icon: Pocket,
            },
        ],
    },
    {
        label: "Configuration",
        items: [
            {
                title: "Manage Shop",
                url: "/manage-shop",
                icon: Store,
            },
            {
                title: "Landing Page",
                url: "/landing-page",
                icon: PanelTop,
            },
            {
                title: "Employees",
                url: "/employees",
                icon: ShieldPlus,
            },
            {
                title: "Subscriptions",
                url: "/subscriptions",
                icon: Crown,
            },
            {
                title: "Courses",
                url: "/courses",
                icon: CirclePlay,
            },
            {
                title: "Tickets",
                url: "/tickets",
                icon: MessageSquare,
            },
        ],
    },
];

export const UserNavData = [
    {
        label: "",
        items: [
            {
                title: "Dashboard",
                url: "/",
                icon: LayoutDashboard,
            },
            {
                title: "Portfolio Builder",
                url: "/portfolio-builder",
                icon: ArrowDown,
            },
            {
                title: "Portfolios",
                url: "/portfolios",
                icon: Folder,
            },
            {
                title: "Templates",
                url: "/templates",
                icon: PanelTop,
            },
        ],
    },
];
