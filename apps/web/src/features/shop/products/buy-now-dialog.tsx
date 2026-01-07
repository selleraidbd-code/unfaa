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

import { CreateOrderPayload, OrderSource, OrderStatus } from "@/types/order-type";
import { Product, ProductVariantOption } from "@/types/product-type";
import { formatPhoneNumber } from "@/lib/format-number-utils";
import { collectTrackingData } from "@/lib/tracking-utils";
import { useCheckoutManagement } from "@/hooks/use-checkout-management";

interface BuyNowDialogProps {
    product: Product;
}

export const BuyNowDialog = ({ product }: BuyNowDialogProps) => {
    const { checkOrderLimit, incrementOrderCount, getLimitErrorMessage, getCheckoutFormData, saveCheckoutFormData } =
        useCheckoutManagement();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [deliveryOption, setDeliveryOption] = useState("inside-dhaka");
    const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariantOption>>({});
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        address: "",
        phone: "",
    });

    useEffect(() => {
        const savedForm = getCheckoutFormData();
        if (savedForm) {
            setCustomerInfo(savedForm);
        }

        // Set default variants to the first option of each variant
        if (product.productVariant && product.productVariant.length > 0) {
            const defaultVariants: Record<string, ProductVariantOption> = {};
            product.productVariant.forEach((variant) => {
                if (variant.options && variant.options.length > 0) {
                    const firstOption = variant.options[0];
                    if (firstOption) {
                        defaultVariants[variant.id] = firstOption;
                    }
                }
            });
            setSelectedVariants(defaultVariants);
        }
    }, [open, product, getCheckoutFormData]);

    const deliveryOptions = [
        { value: "inside-dhaka", label: "Inside Dhaka", price: 60 },
        { value: "outside-dhaka", label: "Outside Dhaka", price: 120 },
    ];

    // Calculate variant extra prices
    const variantExtraPrice = Object.values(selectedVariants).reduce(
        (sum, option) => sum + (option.extraPrice || 0),
        0
    );

    const subtotal = (product.discountPrice + variantExtraPrice) * quantity;
    const deliveryCharge = deliveryOptions.find((opt) => opt.value === deliveryOption)?.price || 0;
    const total = subtotal + deliveryCharge;

    const handleInputChange = (field: string, value: string | number) => {
        setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    };

    const url = `${config.serverUrl}/order`;

    const handleConfirmOrder = async () => {
        setIsSubmitting(true);

        // Validate phone number format first
        const formattedPhone = formatPhoneNumber(customerInfo.phone);
        if (!formattedPhone || formattedPhone.length !== 11 || !formattedPhone.startsWith("01")) {
            toast.error("সঠিক মোবাইল নাম্বার লিখুন (০১XXXXXXXXX)");
            setIsSubmitting(false);
            return;
        }

        // Check order limit before proceeding
        const limitCheck = checkOrderLimit(customerInfo.phone);
        if (limitCheck.isLimitReached) {
            toast.error(getLimitErrorMessage());
            setIsSubmitting(false);
            return;
        }

        // Build order item variants from selected variants
        const orderItemVariant = Object.entries(selectedVariants).map(([variantId, option]) => ({
            productVariantId: variantId,
            productVariantOptionId: option.id,
        }));

        // Collect tracking data (include phone number in phRaw)
        const trackingData = collectTrackingData(customerInfo.phone);

        // Determine order source based on tracking data
        let orderSource = OrderSource.WEBSITE; // Default to website

        if (trackingData) {
            // Check for Facebook tracking parameters
            const isFacebook = trackingData.fbclid || trackingData.fbc || trackingData.fbp;
            // Check for TikTok tracking parameters
            const isTikTok = trackingData.ttclid || trackingData.ttp;

            if (isFacebook) {
                orderSource = OrderSource.WEBSITE_FACEBOOK;
            } else if (isTikTok) {
                orderSource = OrderSource.WEBSITE_TIKTOK;
            }
        }

        const payload: CreateOrderPayload = {
            shopId: product.shopId,
            customerName: customerInfo.name,
            customerPhoneNumber: formattedPhone,
            customerAddress: customerInfo.address,
            deliveryZoneId: product?.delivery?.deliveryZones?.[0]?.id || "",
            orderStatus: OrderStatus.PLACED,
            orderSource,
            orderItems: [{ productId: product.id, quantity, orderItemVariant }],
            trackingData,
        };

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            toast.error(errorData.message || "Failed to create order");
            setIsSubmitting(false);
            return;
        }

        await response.json();

        // Increment order count after successful order
        incrementOrderCount(customerInfo.phone);

        // Save form data to localStorage for next time
        saveCheckoutFormData({
            name: customerInfo.name,
            phone: customerInfo.phone,
            address: customerInfo.address,
        });

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
                                {(product.discountPrice + variantExtraPrice).toFixed(2)} x {quantity} = ৳{" "}
                                <span className="font-semibold">{subtotal.toFixed(2)}</span>
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

                    {/* Variant Options */}
                    {product.productVariant && product.productVariant.length > 0 && (
                        <div className="space-y-4">
                            {product.productVariant.map((variant) => (
                                <div key={variant.id} className="space-y-3">
                                    <h3 className="text-lg font-medium">{variant.name}</h3>
                                    <RadioGroup
                                        value={selectedVariants[variant.id]?.id || ""}
                                        onValueChange={(optionId) => {
                                            const selectedOption = variant.options.find((opt) => opt.id === optionId);
                                            if (selectedOption) {
                                                setSelectedVariants((prev) => ({
                                                    ...prev,
                                                    [variant.id]: selectedOption,
                                                }));
                                            }
                                        }}
                                        className="flex flex-wrap gap-4"
                                    >
                                        {variant.options.map((option) => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value={option.id}
                                                    id={`variant-${variant.id}-option-${option.id}`}
                                                    className="text-purple-600"
                                                />
                                                <Label
                                                    htmlFor={`variant-${variant.id}-option-${option.id}`}
                                                    className="flex cursor-pointer items-center gap-2"
                                                >
                                                    {option.imgUrl && (
                                                        <img
                                                            src={option.imgUrl}
                                                            alt={option.name}
                                                            className="h-12 w-12 rounded object-cover"
                                                        />
                                                    )}
                                                    <span>
                                                        {option.name}
                                                        {option.extraPrice > 0 && (
                                                            <span className="ml-1 text-sm text-gray-600">
                                                                (+৳{option.extraPrice.toFixed(2)})
                                                            </span>
                                                        )}
                                                    </span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Delivery Options */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium">ডেলিভারি চার্জ</h3>
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
