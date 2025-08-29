import { EmployeeRole } from "@/types";

export interface EmployeeRoleOption {
    label: string;
    value: EmployeeRole;
}

/**
 * Utility function to get all employee role options with proper labels
 * @returns Array of employee role options with label and value
 */
export const getEmployeeRoleOptions = (): EmployeeRoleOption[] => {
    return [
        { label: "Order Management", value: EmployeeRole.ORDER_MANAGEMENT },
        { label: "Finance", value: EmployeeRole.FINANCE },
        { label: "User Management", value: EmployeeRole.USER_MANAGEMENT },
        { label: "Product Management", value: EmployeeRole.PRODUCT_MANAGEMENT },
        {
            label: "Inventory Management",
            value: EmployeeRole.INVENTORY_MANAGEMENT,
        },
        { label: "Marketing", value: EmployeeRole.MARKETING },
        { label: "Site Builder", value: EmployeeRole.SITE_BUILDER },
        { label: "Other", value: EmployeeRole.OTHER },
    ];
};

/**
 * Utility function to get employee role label by value
 * @param value - The employee role value
 * @returns The formatted label for the role
 */
export const getEmployeeRoleLabel = (value: EmployeeRole): string => {
    const options = getEmployeeRoleOptions();
    const option = options.find((opt) => opt.value === value);
    return option?.label || value.replace(/_/g, " ").toLowerCase();
};

/**
 * Utility function to format employee role for display
 * @param role - The employee role string
 * @returns Formatted role string
 */
export const formatEmployeeRole = (role: string): string => {
    return role.replace(/_/g, " ").toLowerCase();
};
