import { EmployeeRole } from "@/types";

export interface Employee {
    id: string;
    userId: string;
    shopId: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
    roles: EmployeeRole[];
    shop: {
        id: string;
        name: string;
    };
}

export interface CreateEmployee {
    employeeInfo: {
        name: string;
        email: string;
        password: string;
    };
    employeeRoles: string[];
}

export interface UpdateEmployee {
    id: string;
    payload: {
        roles: string[];
    };
}
