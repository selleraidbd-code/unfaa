export enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    ONGOING = "ongoing",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
}

export enum OrderPaymentMethod {
    CASH = "cash",
    INSTALLMENT = "installment",
}

export enum InstallmentStatus {
    PENDING = "pending",
    PARTIAL = "partial",
    PAID = "paid",
    FAILED = "failed",
    OVERDUE = "overdue",
}

export type Installment = {
    id: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: InstallmentStatus;
    orderId?: string;
};

export type Payment = {
    id: string;
    amount: number;
    count: number;
    customerId: string;
    dueDate: string | null;
    orderId: string;
    paidOn: string | null;
    paymentStatus: PaymentStatus;
    paymentType: "installment" | "full";
    createdAt: string;
    updatedAt: string;
};

export type Order = {
    id: string;
    customer: {
        id: number;
        name: string;
        email: string;
    };
    customerId: string;
    totalAmount: number;
    orderPaymentType: OrderPaymentMethod;
    orderStatus: OrderStatus;
    payment: Payment[];
    createdAt: string;
};

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CustomItem {
    name: string;
    price: number;
    quantity: number;
}

export type SalesOverview = {
    totalIncomeThisMonth: number;
    totalOrder: number;
    totalPaid: number;
    totalDue: number;
};

export type InstallmentItem = {
    count: number;
    amount: number;
    paymentStatus: PaymentStatus;
    paidOn: string;
    dueDate: string;
};

export type CreateSalePayload = {
    customerId: string;
    orderData: {
        orderItems: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        vatAmount?: number;
        discountAmount?: number;
        orderStatus: OrderStatus;
    };
    payments?: InstallmentItem[];
};
