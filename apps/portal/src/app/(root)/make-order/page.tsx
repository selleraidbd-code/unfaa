"use client";

import { CustomerStep } from "@/features/make-order/customer-step/customer-step";
import { OrderDetailsStep } from "@/features/make-order/details-step/order-details-step";
import { ProductsStep } from "@/features/make-order/product-step/products-step";
import { StepIndicator } from "@/features/make-order/StepIndicator";
import useGetUser from "@/hooks/useGetUser";
import { useCreateOrderbyAdminMutation } from "@/redux/api/order-api";
import { Customer } from "@/types/customer-type";
import {
    CreateOrder,
    OrderStatus,
    OrderStepIndicator,
} from "@/types/order-type";
import { OrderItem } from "@/types/order-type copy";
import { Product } from "@/types/product-type";
import { useState } from "react";

import { toast } from "sonner";

export type OrderDetails = {
    orderNotes: string;
    deliveryAddress: string;
    orderStatus: OrderStatus;
    assignedTo: string;
    deliveryId: string;
};

const Page = () => {
    const user = useGetUser();
    const [activeStep, setActiveStep] = useState(OrderStepIndicator.CUSTOMER);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null
    );
    const [orderDetails, setOrderDetails] = useState<OrderDetails>({
        orderNotes: "",
        deliveryAddress: "",
        orderStatus: OrderStatus.CONFIRMED,
        assignedTo: "",
        deliveryId: "",
    });

    const [createOrder, { isLoading }] = useCreateOrderbyAdminMutation();

    // Add product to order
    const addProductToOrder = (product: Product) => {
        const existingItem = orderItems.find((item) => item.id === product.id);

        if (existingItem) {
            setOrderItems(
                orderItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setOrderItems([
                ...orderItems,
                {
                    ...product,
                    quantity: 1,
                    price: product.price || 0,
                },
            ]);
        }
    };

    // Update quantity of a product
    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setOrderItems(
            orderItems.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Calculate order subtotal
    const calculateTotal = () => {
        return orderItems.reduce((total, item) => {
            const itemTotal = item.price * item.quantity;
            return total + itemTotal;
        }, 0);
    };

    // Remove product from order
    const removeOrderItem = (productId: string) => {
        setOrderItems(orderItems.filter((item) => item.id !== productId));
    };

    const handleSubmitOrder = async () => {
        if (!user) {
            toast.error("You are not authorized to create an order");
            return;
        }

        if (!selectedCustomer) {
            toast.error("Please select a customer");
            return;
        }
        if (orderItems.length === 0) {
            toast.error("Please add at least one product to the order");
            return;
        }

        const payload: CreateOrder = {
            shopId: user.shop.id,
            customerId: selectedCustomer.id,
            orderItems: orderItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                productPrice: item.price,
                orderItemVariant: [],
            })),
            customerAddress: orderDetails.deliveryAddress,
            orderStatus: OrderStatus.PLACED,
            notes: orderDetails.orderNotes,
            deliveryZoneId: orderDetails.deliveryId,
        };

        await createOrder({
            assignedTo: orderDetails.assignedTo || user.id,
            payload,
        })
            .unwrap()
            .then(() => {
                toast.success("Order created successfully!");
                setActiveStep(OrderStepIndicator.CUSTOMER);
                setOrderItems([]);
                setOrderDetails({
                    orderNotes: "",
                    deliveryAddress: "",
                    orderStatus: OrderStatus.CONFIRMED,
                    assignedTo: "",
                    deliveryId: "",
                });
                setSelectedCustomer(null);
            })
            .catch((err) => {
                toast.error(err.data.message);
                console.log("err :>> ", err);
            });
    };

    return (
        <>
            <StepIndicator
                orderItems={orderItems}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
            />

            <section>
                {activeStep === OrderStepIndicator.CUSTOMER && (
                    <CustomerStep
                        selectedCustomer={selectedCustomer}
                        setSelectedCustomer={setSelectedCustomer}
                        setActiveStep={setActiveStep}
                    />
                )}

                {activeStep === OrderStepIndicator.PRODUCTS && (
                    <ProductsStep
                        orderItems={orderItems}
                        addProductToOrder={addProductToOrder}
                        updateQuantity={updateQuantity}
                        removeOrderItem={removeOrderItem}
                        setActiveStep={setActiveStep}
                        calculateTotal={calculateTotal}
                    />
                )}

                {activeStep === OrderStepIndicator.DETAILS && (
                    <OrderDetailsStep
                        orderDetails={orderDetails}
                        setOrderDetails={setOrderDetails}
                        canCompleteOrder={
                            orderItems.length > 0 && Boolean(selectedCustomer)
                        }
                        handleSubmitOrder={handleSubmitOrder}
                        setActiveStep={setActiveStep}
                        isLoading={isLoading}
                    />
                )}
            </section>
        </>
    );
};

export default Page;
