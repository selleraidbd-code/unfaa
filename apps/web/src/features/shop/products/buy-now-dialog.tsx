"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { config } from "@/config";
import { QuantitySelector } from "@/features/shop/products/quantity-selector";
import { Button } from "@workspace/ui/components/button";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import { CustomTextarea } from "@workspace/ui/components/custom/custom-textarea";
import {
    Dialog,
    DialogContainer,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { toast } from "@workspace/ui/components/sonner";

import { CreateOrderPayload, OrderStatus } from "@/types/order-type";
import { Product } from "@/types/product-type";

interface BuyNowDialogProps {
    product: Product;
}

export const BuyNowDialog = ({ product }: BuyNowDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [deliveryOption, setDeliveryOption] = useState("inside-dhaka");
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        address: "",
        phone: "",
    });

    useEffect(() => {
        const savedForm = localStorage.getItem("checkout_form");
        if (savedForm) {
            const parsedForm = JSON.parse(savedForm);
            setCustomerInfo(parsedForm);
        }
    }, [open]);

    const deliveryOptions = [
        { value: "inside-dhaka", label: "Inside Dhaka", price: 60 },
        { value: "outside-dhaka", label: "Outside Dhaka", price: 120 },
    ];

    const subtotal = product.discountPrice * quantity;
    const deliveryCharge = deliveryOptions.find((opt) => opt.value === deliveryOption)?.price || 0;
    const vat = 0; // 0% VAT as shown in the image
    const total = subtotal + deliveryCharge + vat;

    const handleInputChange = (field: string, value: string | number) => {
        setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    };

    const url = `${config.serverUrl}/order`;

    const handleConfirmOrder = async () => {
        setIsSubmitting(true);
        const payload: CreateOrderPayload = {
            shopId: product.shopId,
            customerName: customerInfo.name,
            customerPhoneNumber: customerInfo.phone,
            customerAddress: customerInfo.address,
            deliveryZoneId: product?.delivery?.deliveryZones?.[0]?.id || "",
            orderStatus: OrderStatus.PLACED,
            orderItems: [{ productId: product.id, quantity, orderItemVariant: [] }],
        };

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to create order");
        }

        const data = await response.json();
        console.log("data", data);
        toast.success("Order created successfully");
        setIsSubmitting(false);
        setOpen(false);
    };

    const handleQuantityDecrease = () => {
        const newQuantity = quantity - 1;
        setQuantity(Math.max(1, newQuantity));
    };

    const handleQuantityIncrease = () => {
        const newQuantity = Math.min(100, quantity + 1);
        setQuantity(newQuantity);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={"lg"} className="flex-1 bg-black text-white hover:bg-gray-800">
                    Buy Now
                </Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Place Order</DialogTitle>
                    <DialogDescription className="sr-only">
                        Please fill out the form below to place your order.
                    </DialogDescription>
                </DialogHeader>

                <DialogContainer className="mb-0 max-h-[75vh] space-y-6">
                    {/* Product Details */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2">
                            <Image
                                src={product.photoURL || "/placeholder.jpg"}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="size-16 rounded object-cover"
                            />
                            <div className="space-y-1">
                                <h3 className="font-semibold">{product.name}</h3>
                                <p>Price: ৳{product.discountPrice}</p>
                                {/* <p>Size: 1kg - 2kg</p> */}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <QuantitySelector
                                quantity={quantity}
                                onQuantityIncrease={handleQuantityIncrease}
                                onQuantityDecrease={handleQuantityDecrease}
                            />

                            <p className="min-w-[160px] pr-4 text-right text-lg md:min-w-[200px]">
                                {product.discountPrice} x {quantity} = ৳{" "}
                                <span className="font-semibold">{subtotal}</span>
                            </p>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput
                                label="নাম"
                                value={customerInfo.name}
                                required
                                placeholder="আপনার নাম লিখুন..."
                                onChange={(value) => handleInputChange("name", value)}
                            />
                            <CustomInput
                                label="ফোন নম্বর"
                                value={customerInfo.phone}
                                required
                                placeholder="আপনার ফোন নম্বর লিখুন..."
                                onChange={(value) => handleInputChange("phone", value)}
                            />
                        </div>

                        <CustomTextarea
                            label="ঠিকানা"
                            value={customerInfo.address}
                            placeholder="গ্রামের নাম, থানার নাম, জেলার নাম লিখুন..."
                            onChange={(value) => handleInputChange("address", value)}
                        />
                    </div>

                    {/* Delivery Options */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium">Select Delivery Option</h3>
                        <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption} className="flex gap-6">
                            {deliveryOptions.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value={option.value}
                                        id={option.value}
                                        className="text-purple-600"
                                    />
                                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                                        {option.label} (৳
                                        {option.price.toFixed(2)})
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Order Summary */}
                    <div className="rounded-lg border bg-gray-50 p-4">
                        <h3 className="mb-3 text-lg font-semibold">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Sub Total:</span>
                                <span>৳{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>VAT / TAX (0%):</span>
                                <span>৳{vat.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery charge:</span>
                                <span>৳{deliveryCharge.toFixed(2)}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total:</span>
                                <span>৳{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </DialogContainer>

                {/* Confirm Order Button */}
                <Button onClick={handleConfirmOrder} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Confirm Order"}
                </Button>
            </DialogContent>
        </Dialog>
    );
};
