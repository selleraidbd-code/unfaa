import { OrderStatus } from "@/types/order-type";

export const orderStatusOptions = [
    {
        label: "All Orders",
        value: "all",
    },
    {
        label: "Order Placed",
        value: OrderStatus.PLACED,
    },
    {
        label: "Order Confirmed",
        value: OrderStatus.CONFIRMED,
    },
    {
        label: "Order Canceled",
        value: OrderStatus.CANCELLED,
    },
    {
        label: "Order Send",
        value: OrderStatus.SEND,
    },
    {
        label: "Order Hold",
        value: OrderStatus.HOLD,
    },
    {
        label: "Order Waiting ",
        value: OrderStatus.WAITING,
    },
    {
        label: "Order NZC",
        value: OrderStatus.NZC,
    },
    {
        label: "Order Returned",
        value: OrderStatus.RETURN,
    },
    {
        label: "Order Delivered",
        value: OrderStatus.RECEIVED,
    },
    {
        label: "Delivery Pending",
        value: OrderStatus.PROCESSING,
    },
    {
        label: "Delivery Completed",
        value: OrderStatus.INCOMPLETE,
    },
];
