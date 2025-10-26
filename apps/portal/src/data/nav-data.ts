import { UserRole } from "@/types";
import {
    CirclePlay,
    Component,
    Crown,
    LayoutDashboard,
    MonitorUp,
    Package,
    PanelTop,
    Pocket,
    ScanBarcode,
    ShieldPlus,
    ShoppingBag,
    ShoppingCart,
    Store,
    Users,
    ArrowDown,
    Folder,
    Bot,
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
                title: "Upload Tutorial",
                url: "/upload-tutorial",
                icon: MonitorUp,
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
            {
                title: "Orders",
                url: "/orders",
                icon: ShoppingCart,
            },
            {
                title: "AI Order",
                url: "/ai-order",
                icon: Bot,
            },
            {
                title: "Products",
                url: "/products",
                icon: ShoppingBag,
            },
            {
                title: "Categories",
                url: "/categories",
                icon: Package,
                subItems: [
                    {
                        title: "Create",
                        url: "/categories/create",
                    },
                ],
            },
            {
                title: "Brands",
                url: "/brands",
                icon: Pocket,
            },
            {
                title: "Employees",
                url: "/employees",
                icon: ShieldPlus,
            },
            {
                title: "Customers",
                url: "/customers",
                icon: Users,
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
                title: "Subscriptions",
                url: "/subscriptions",
                icon: Crown,
            },
            {
                title: "Tutorial",
                url: "/tutorial",
                icon: CirclePlay,
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
