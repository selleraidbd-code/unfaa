import { LucideIcon } from "lucide-react";

export interface NavItem {
    title: string;
    url: string;
    activeSubPaths?: string[];
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
    }[];
}

export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    SELLER = "SELLER",
    USER = "USER",
    EMPLOYEE = "EMPLOYEE",
}

export enum EmployeeRole {
    ORDER_MANAGEMENT = "order",
    FINANCE = "finance",
    USER_MANAGEMENT = "userManagement",
    PRODUCT_MANAGEMENT = "productManagement",
    INVENTORY_MANAGEMENT = "inventoryManagement",
    MARKETING = "marketing",
    SITE_BUILDER = "siteBuilder",
    OTHER = "other",
}

export enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export enum SubscriptionType {
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    HALF_YEARLY = "HALF_YEARLY",
}
