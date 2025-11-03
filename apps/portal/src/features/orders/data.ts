import { OrderStatus } from "@/types/order-type";
import {
    PackageCheck,
    ShoppingCart,
    PauseCircle,
    Clock,
    CheckCircle2,
    XCircle,
} from "lucide-react";

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
        label: "Order Hold",
        value: OrderStatus.HOLD,
        icon: PauseCircle,
    },
    {
        label: "Order Waiting ",
        value: OrderStatus.WAITING,
        icon: Clock,
    },
    {
        label: "Order Confirmed",
        value: OrderStatus.CONFIRMED,
        icon: CheckCircle2,
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
