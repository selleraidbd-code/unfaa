"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { config } from "@/config";
import { toast } from "@workspace/ui/components/sonner";

import { Package, WithProductPackage } from "@/types/landing-type";
import { CreateOrderPayload, OrderSource, OrderStatus } from "@/types/order-type";
import { Product, ProductVariantOption } from "@/types/product-type";
import { formatPhoneNumber } from "@/lib/format-number-utils";
import { getLink } from "@/lib/get-link";
import { buildUserData, trackEventToBackend, trackTikTokPixel } from "@/lib/tracking-events";
import { collectTrackingData } from "@/lib/tracking-utils";
import { useOrderDataManageLocally } from "@/hooks/use-order-data-manage-locally";
import { buildTikTokPackageContents, buildTikTokProductContents, trackTikTokEvent } from "@/hooks/use-tiktok-tracking";

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

export const useOrderForm = (product: Product | WithProductPackage, shopSlug: string) => {
    const router = useRouter();
    const { checkOrderLimit, incrementOrderCount, getLimitErrorMessage, getCheckoutFormData, saveCheckoutFormData } =
        useOrderDataManageLocally();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        address: "",
        phone: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<string>("");
    const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariantOption>>({});
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    // Track user-selected variants for package products where packageProductVariants is empty
    // Structure: { [packageProductId]: { [variantId]: ProductVariantOption } }
    const [selectedPackageProductVariants, setSelectedPackageProductVariants] = useState<
        Record<string, Record<string, ProductVariantOption>>
    >({});

    // Check if product has packages
    const packages = "package" in product ? product.package : [];

    // Load saved form data from localStorage on mount
    useEffect(() => {
        const savedForm = getCheckoutFormData();
        if (savedForm) {
            setFormData(savedForm);
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

        // Set default package to the first one if packages exist
        if (packages && packages.length > 0 && packages[0]) {
            setSelectedPackage(packages[0]);
        }
    }, [product, getCheckoutFormData]);

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
            // Normalize phone number (remove country code if present)
            const normalizedPhone = formatPhoneNumber(formData.phone);

            // Validate phone number: must be 11 digits and start with 01
            if (!normalizedPhone || normalizedPhone.length !== 11 || !normalizedPhone.startsWith("01")) {
                setErrors((prev) => ({ ...prev, phone: "সঠিক মোবাইল নাম্বার লিখুন (০১XXXXXXXXX)" }));
                setIsSubmitting(false);
                return;
            }

            // Check order limit before proceeding
            const limitCheck = checkOrderLimit(formData.phone);
            if (limitCheck.isLimitReached) {
                toast.error(getLimitErrorMessage());
                setIsSubmitting(false);
                return;
            }

            // Collect tracking data (include phone number in phRaw)
            const trackingData = collectTrackingData(formData.phone);

            // Determine order source based on tracking data
            let orderSource = OrderSource.WEBSITE; // Default to website
            let isTikTok = false;

            if (trackingData) {
                // Check for Facebook tracking parameters
                const isFacebook = trackingData.utmSource === "fb" || trackingData.utmSource === "facebook";

                // Check for TikTok tracking parameters
                isTikTok = !!(trackingData.utmSource === "tiktok");

                if (isFacebook) {
                    orderSource = OrderSource.WEBSITE_FACEBOOK;
                } else if (isTikTok) {
                    orderSource = OrderSource.WEBSITE_TIKTOK;
                }
            }

            // Build order items based on whether package is selected
            let orderItems: CreateOrderPayload["orderItems"];

            if (selectedPackage) {
                // If package is selected, create order items for all products in the package
                orderItems = selectedPackage.packageProducts.map((packageProduct) => {
                    let orderItemVariant: { productVariantId: string; productVariantOptionId: string }[];

                    if (packageProduct.packageProductVariants.length > 0) {
                        // Use pre-selected variants from the package
                        orderItemVariant = packageProduct.packageProductVariants.map((variant) => ({
                            productVariantId: variant.productVariantId || "",
                            productVariantOptionId: variant.productVariantOptionId,
                        }));
                    } else if (selectedPackageProductVariants[packageProduct.id]) {
                        // Use user-selected variants for this package product
                        orderItemVariant = Object.entries(selectedPackageProductVariants[packageProduct.id]!).map(
                            ([variantId, option]) => ({
                                productVariantId: variantId,
                                productVariantOptionId: option.id,
                            })
                        );
                    } else {
                        orderItemVariant = [];
                    }

                    return {
                        productId: packageProduct.productId,
                        quantity: packageProduct.quantity,
                        orderItemVariant,
                    };
                });
            } else {
                // Normal product order
                const orderItemVariant = Object.entries(selectedVariants).map(([variantId, option]) => ({
                    productVariantId: variantId,
                    productVariantOptionId: option.id,
                }));

                orderItems = [
                    {
                        productId: product.id,
                        quantity: 1,
                        orderItemVariant,
                    },
                ];
            }

            // Calculate delivery charge
            const selectedZone = product.delivery?.deliveryZones?.find(
                (zone) => zone.id === (selectedDeliveryZone || product?.delivery?.deliveryZones?.[0]?.id)
            );
            const deliveryCharge = selectedZone?.fee || 0;

            // Calculate discountedPrice: if package selected, use codAmount + delivery charge, otherwise null
            const discountedPrice = selectedPackage ? selectedPackage.codAmount + deliveryCharge : null;

            const payload: CreateOrderPayload = {
                shopId: product.shopId,
                customerName: formData.name,
                customerPhoneNumber: normalizedPhone,
                customerAddress: formData.address,
                deliveryZoneId: selectedDeliveryZone || product?.delivery?.deliveryZones?.[0]?.id || "",
                orderStatus: OrderStatus.PLACED,
                orderSource,
                orderItems,
                trackingData,
                discountedPrice,
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
                setIsSubmitting(false);
                return;
            }

            const data = await response.json();

            // Increment order count after successful order
            incrementOrderCount(formData.phone);

            // Save form data to localStorage for next time
            saveCheckoutFormData({
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
            });

            // Track Purchase event
            const purchaseEventId = `purchase_${data?.data?.id || Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            const orderId = data?.data?.orderSerialNumber || data?.data?.id;

            // Track TikTok Purchase event if TikTok tracking information is present
            if (isTikTok) {
                // Build contents array for TikTok Purchase event
                const contents = selectedPackage
                    ? buildTikTokPackageContents(selectedPackage, product)
                    : buildTikTokProductContents(product, selectedVariants, 1);

                // Track TikTok Purchase event
                trackTikTokEvent(
                    "Purchase",
                    {
                        event_id: purchaseEventId,
                        contents,
                        value: totalAmount,
                        currency: "BDT",
                        order_id: orderId,
                    },
                    trackingData
                );
            } else {
                // Build contents array for TikTok Purchase event (even without tracking data)
                const contents = selectedPackage
                    ? buildTikTokPackageContents(selectedPackage, product)
                    : buildTikTokProductContents(product, selectedVariants, 1);

                // Track TikTok Purchase event even if no tracking data
                trackTikTokPixel("Purchase", {
                    event_id: purchaseEventId,
                    contents,
                    value: totalAmount,
                    currency: "BDT",
                    order_id: orderId,
                });
            }

            toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে! ✅");

            // Redirect to success page
            router.replace(
                getLink({
                    shopSlug: shopSlug,
                    path: `/order-success?order=${data?.data?.orderSerialNumber}`,
                })
            );
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("অর্ডার তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
            setIsSubmitting(false);
        }
    };

    // Calculate total amount
    const calculateTotal = (): number => {
        let total: number;

        if (selectedPackage) {
            // Use package price
            total = selectedPackage.codAmount;
        } else {
            // Use product price
            total = product.discountPrice;

            // Add variant extra prices
            Object.values(selectedVariants).forEach((option) => {
                total += option.extraPrice;
            });
        }

        // Add delivery zone fee
        const selectedZone = product.delivery?.deliveryZones?.find((zone) => zone.id === selectedDeliveryZone);
        if (selectedZone) {
            total += selectedZone.fee;
        }

        return total;
    };

    const totalAmount = calculateTotal();

    const handlePackageSelect = (packageId: string | null) => {
        if (packageId) {
            const pkg = packages.find((p) => p.id === packageId);
            setSelectedPackage(pkg || null);

            // Auto-initialize variant selections for package products that need user input
            if (pkg) {
                const defaults: Record<string, Record<string, ProductVariantOption>> = {};
                pkg.packageProducts.forEach((pp) => {
                    // Only if packageProductVariants is empty but product has variants
                    if (pp.packageProductVariants.length === 0 && pp.product?.productVariant?.length) {
                        const variantDefaults: Record<string, ProductVariantOption> = {};
                        pp.product.productVariant.forEach((variant) => {
                            if (variant.options.length > 0 && variant.options[0]) {
                                variantDefaults[variant.id] = variant.options[0];
                            }
                        });
                        defaults[pp.id] = variantDefaults;
                    }
                });
                setSelectedPackageProductVariants(defaults);
            }
        } else {
            setSelectedPackage(null);
            setSelectedPackageProductVariants({});
        }
    };

    const handlePackageProductVariantChange = (
        packageProductId: string,
        variantId: string,
        option: ProductVariantOption
    ) => {
        setSelectedPackageProductVariants((prev) => ({
            ...prev,
            [packageProductId]: {
                ...prev[packageProductId],
                [variantId]: option,
            },
        }));
    };

    return {
        formData,
        errors,
        isSubmitting,
        selectedDeliveryZone,
        selectedVariants,
        selectedPackage,
        selectedPackageProductVariants,
        packages,
        totalAmount,
        handleInputChange,
        handleVariantChange,
        setSelectedDeliveryZone,
        handlePackageSelect,
        handlePackageProductVariantChange,
        handleSubmit,
    };
};
