"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { config } from "@/config";
import { toast } from "@workspace/ui/components/sonner";

import { CreateOrderPayload, OrderSource, OrderStatus } from "@/types/order-type";
import { Product, ProductVariantOption } from "@/types/product-type";
import { getLink } from "@/lib/get-link";
import { collectTrackingData, normalizePhoneNumber } from "@/lib/tracking-utils";

type FormData = {
    name: string;
    address: string;
    phone: string;
};

type FormErrors = {
    name?: string;
    address?: string;
    phone?: string;
};

export const useOrderForm = (product: Product, shopSlug: string) => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        address: "",
        phone: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<string>("");
    const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariantOption>>({});

    // Load saved form data from localStorage on mount
    useEffect(() => {
        const savedForm = localStorage.getItem("checkout_form");
        if (savedForm) {
            try {
                const parsedForm = JSON.parse(savedForm);
                setFormData(parsedForm);
            } catch (error) {
                console.error("Error parsing saved form:", error);
            }
        }

        // Set default delivery zone to the first one
        if (product.delivery?.deliveryZones && product.delivery.deliveryZones.length > 0) {
            setSelectedDeliveryZone(product.delivery.deliveryZones[0]?.id || "");
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
    }, [product]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleVariantChange = (variantId: string, option: ProductVariantOption) => {
        setSelectedVariants((prev) => ({ ...prev, [variantId]: option }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = "নাম লিখুন";
        if (!formData.address.trim()) newErrors.address = "ঠিকানা লিখুন";

        const clean = formData.phone.replace(/[\s-]/g, "");
        const isValidPhone = /^\+8801[3-9][0-9]{8}$/.test(clean) || /^01[3-9][0-9]{8}$/.test(clean);
        if (!isValidPhone) newErrors.phone = "সঠিক ফোন নাম্বার লিখুন";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        // Check if product has variants and if they're selected
        if (product.productVariant && product.productVariant.length > 0) {
            for (const variant of product.productVariant) {
                if (variant.isRequired && !selectedVariants[variant.id]) {
                    toast.error(`অনুগ্রহ করে ${variant.name} নির্বাচন করুন`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Build order item variants
            const orderItemVariant = Object.entries(selectedVariants).map(([variantId, option]) => ({
                productVariantId: variantId,
                productVariantOptionId: option.id,
            }));

            // Normalize phone number (remove country code if present)
            const normalizedPhone = normalizePhoneNumber(formData.phone);

            // Collect tracking data (include phone number in phRaw)
            const trackingData = collectTrackingData(formData.phone);

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
                customerName: formData.name,
                customerPhoneNumber: normalizedPhone,
                customerAddress: formData.address,
                deliveryZoneId: selectedDeliveryZone || product?.delivery?.deliveryZones?.[0]?.id || "",
                orderStatus: OrderStatus.PLACED,
                orderSource,
                orderItems: [
                    {
                        productId: product.id,
                        quantity: 1,
                        orderItemVariant,
                    },
                ],
                trackingData,
            };

            const url = `${config.serverUrl}/order`;

            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || "অর্ডার তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
                return;
            }

            const data = await response.json();
            console.log("Order created:", data);

            // Save form data to localStorage for next time
            localStorage.setItem(
                "checkout_form",
                JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                })
            );

            toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে! ✅");

            // Redirect to success page
            router.push(
                getLink({
                    shopSlug: shopSlug,
                    path: `/order-success?order=${data?.data?.orderSerialNumber}`,
                })
            );
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("অর্ডার তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        selectedDeliveryZone,
        selectedVariants,
        handleInputChange,
        handleVariantChange,
        setSelectedDeliveryZone,
        handleSubmit,
    };
};
