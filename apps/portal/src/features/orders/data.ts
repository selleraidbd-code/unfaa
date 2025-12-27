import { CheckCircle2, Clock, PackageCheck, PauseCircle, ShoppingCart, XCircle } from "lucide-react";

import { OrderStatus } from "@/types/order-type";

export const orderStatusOptions = [
    {
        label: "All Orders",
        value: "all",
        icon: PackageCheck,
    },
    {
        label: "Order Placed",
        value: OrderStatus.PLACED,
        icon: ShoppingCart,
    },
    {
        label: "Order Confirmed",
        value: OrderStatus.CONFIRMED,
        icon: CheckCircle2,
    },
    {
        label: "Order Hold",
        value: OrderStatus.HOLD,
        icon: PauseCircle,
    },
    {
        label: "Order Waiting",
        value: OrderStatus.WAITING,
        icon: Clock,
    },
    {
        label: "Order Canceled",
        value: OrderStatus.CANCELLED,
        icon: XCircle,
    },
    // {
    //     label: "Parcel Send",
    //     value: OrderStatus.SEND,
    // },
    // {
    //     label: "Order NZC",
    //     value: OrderStatus.NZC,
    // },
    // {
    //     label: "Order Returned",
    //     value: OrderStatus.RETURN,
    // },
    // {
    //     label: "Order Delivered",
    //     value: OrderStatus.RECEIVED,
    // },
    // {
    //     label: "Delivery Pending",
    //     value: OrderStatus.PROCESSING,
    // },
    // {
    //     label: "Delivery Completed",
    //     value: OrderStatus.INCOMPLETE,
    // },
];

export const orderStatusOptionsMobile = [
    {
        label: "All",
        value: "all",
        icon: PackageCheck,
    },
    {
        label: "Placed",
        value: OrderStatus.PLACED,
        icon: ShoppingCart,
    },
    {
        label: "Confirmed",
        value: OrderStatus.CONFIRMED,
        icon: CheckCircle2,
    },
    {
        label: "Hold",
        value: OrderStatus.HOLD,
        icon: PauseCircle,
    },
    {
        label: "Waiting",
        value: OrderStatus.WAITING,
        icon: Clock,
    },
    {
        label: "Canceled",
        value: OrderStatus.CANCELLED,
        icon: XCircle,
    },
    // {
    //     label: "Parcel Send",
    //     value: OrderStatus.SEND,
    // },
    // {
    //     label: "Order NZC",
    //     value: OrderStatus.NZC,
    // },
    // {
    //     label: "Order Returned",
    //     value: OrderStatus.RETURN,
    // },
    // {
    //     label: "Order Delivered",
    //     value: OrderStatus.RECEIVED,
    // },
    // {
    //     label: "Delivery Pending",
    //     value: OrderStatus.PROCESSING,
    // },
    // {
    //     label: "Delivery Completed",
    //     value: OrderStatus.INCOMPLETE,
    // },
];
