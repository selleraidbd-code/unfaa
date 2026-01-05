"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { config } from "@/config";
import { useShop } from "@/contexts/shop-context";
import BillingDetails from "@/features/shop/checkout/BillingDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { CircleDot } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CreateOrderPayload, OrderSource, OrderStatus } from "@/types/order-type";
import { CartItem, cartStorage } from "@/lib/cart";
import { formatPhoneNumber } from "@/lib/format-number-utils";
import { getLink } from "@/lib/get-link";
import { buildUserData, trackEventToBackend, trackFacebookPixel, trackTikTokPixel } from "@/lib/tracking-events";
import { collectTrackingData } from "@/lib/tracking-utils";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";

const formSchema = z.object({
    name: z
        .string({
            required_error: "আপনার নাম লিখুন",
        })
        .min(3, { message: "আপনার নাম কমপক্ষে ৩ টি অক্ষর হতে হবে" }),
    address: z
        .string({
            required_error: "আপনার ঠিকানা লিখুন",
        })
        .min(4, { message: "ঠিকানা কমপক্ষে ৪ টি অক্ষর হতে হবে" }),
    phone: z
        .string({
            required_error: "ফোন নম্বর লিখুন",
        })
        .min(10, { message: "ফোন নম্বর কমপক্ষে 10 ডিজিট হতে হবে" })
        .refine(
            (value) => {
                const cleanNumber = value.replace(/[\s-]/g, "");

                const bdNumberRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;
                return bdNumberRegex.test(cleanNumber);
            },
            {
                message: "সঠিক বাংলাদেশী ফোন নম্বর দিন",
            }
        ),
    deliveryZoneId: z
        .string({
            required_error: "ডেলিভারি জোন নির্বাচন করুন",
        })
        .min(1, { message: "ডেলিভারি জোন নির্বাচন করুন" }),
});

const Page = () => {
    const router = useRouter();
    const { shop } = useShop();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [summary, setSummary] = useState({
        subtotal: 0,
        shipping: 0,
        total: 0,
        itemCount: 0,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            address: "",
            phone: "",
            deliveryZoneId: "",
        },
    });

    useEffect(() => {
        const updateCart = () => {
            const items = cartStorage.getCart();
            setCartItems(items);
            setSummary(cartStorage.getCartSummary());
        };

        updateCart();
        window.addEventListener("cart-updated", updateCart);
        return () => window.removeEventListener("cart-updated", updateCart);
    }, []);

    // Track InitiateCheckout when checkout page loads
    useEffect(() => {
        if (cartItems.length === 0) return;

        const trackInitiateCheckout = async () => {
            const eventId = `initiatecheckout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            const contentIds = cartItems.map((item) => item.productId);
            const contentNames = cartItems.map((item) => item.name || "").filter(Boolean);
            const totalValue = summary.total;

            // Track to backend
            await trackEventToBackend(
                "InitiateCheckout",
                {
                    event_id: eventId,
                    content_name: contentNames.join(", ") || "Cart Items",
                    content_category: "checkout",
                    content_ids: contentIds,
                    content_type: "product",
                    value: totalValue,
                    currency: "BDT",
                    user_data: buildUserData(),
                },
                shop.slug
            );

            // Track Facebook Pixel
            trackFacebookPixel("InitiateCheckout", {
                content_ids: contentIds,
                content_type: "product",
                value: totalValue,
                currency: "BDT",
                num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
            });

            // Track TikTok Pixel
            trackTikTokPixel("InitiateCheckout", {
                content_ids: contentIds,
                content_type: "product",
                value: totalValue,
                currency: "BDT",
            });
        };

        // Track after a short delay to ensure page is loaded
        const timer = setTimeout(trackInitiateCheckout, 500);
        return () => clearTimeout(timer);
    }, [cartItems.length, summary.total, shop.slug]);

    useEffect(() => {
        const savedForm = localStorage.getItem("checkout_form");
        if (savedForm) {
            const parsedForm = JSON.parse(savedForm);
            form.setValue("name", parsedForm.name);
            form.setValue("address", parsedForm.address);
            form.setValue("phone", parsedForm.phone);
            form.setValue("deliveryZoneId", parsedForm.deliveryZoneId);
            form.reset(parsedForm);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (cartItems.length === 0) {
        return (
            <CustomErrorOrEmpty
                title="আপনি কোন প্রোডাক্ট যোগ করেননি"
                description="আপনার কার্টে কোন প্রোডাক্ট নেই। প্রোডাক্ট যোগ করতে নিচের বাটনে ক্লিক করুন।"
                href={getLink({ shopSlug: shop.slug, path: "/products" })}
                buttonText="প্রোডাক্টগুলো দেখুন"
                className="h-screen"
            />
        );
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);

        try {
            const cartItems = cartStorage.getCart();

            const orderItems = cartItems?.map((item: CartItem) => ({
                productId: item.productId,
                quantity: item.quantity,
                orderItemVariant: item.selectedVariants.map((variant) => ({
                    productVariantId: variant.variantId,
                    productVariantOptionId: variant.optionId,
                })),
            }));

            const formattedPhone = formatPhoneNumber(values.phone);

            // Collect tracking data (include phone number in phRaw)
            const trackingData = collectTrackingData(values.phone);

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

            const order: CreateOrderPayload = {
                shopId: shop.id,
                orderItems,
                customerName: values.name,
                customerPhoneNumber: formattedPhone,
                customerAddress: values.address,
                deliveryZoneId: values.deliveryZoneId,
                orderStatus: OrderStatus.PLACED,
                orderSource,
                trackingData,
            };

            const url = `${config.serverUrl}/order`;

            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(order),
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

            // Track Purchase event
            const purchaseEventId = `purchase_${data?.data?.id || Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            const contentIds = cartItems.map((item) => item.productId);
            const contentNames = cartItems.map((item) => item.name || "").filter(Boolean);
            const totalValue = summary.total;
            const orderId = data?.data?.orderSerialNumber || data?.data?.id;

            // Track to backend
            await trackEventToBackend(
                "Purchase",
                {
                    event_id: purchaseEventId,
                    external_id: orderId,
                    content_name: contentNames.join(", ") || "Order",
                    content_category: "purchase",
                    content_ids: contentIds,
                    content_type: "product",
                    value: totalValue,
                    currency: "BDT",
                    user_data: {
                        ...buildUserData(),
                        phone: formattedPhone,
                        first_name: values.name.split(/\s+/)[0] || "",
                        last_name: values.name.split(/\s+/).slice(1).join(" ") || "",
                    },
                },
                shop.slug
            );

            // Track Facebook Pixel
            trackFacebookPixel("Purchase", {
                content_ids: contentIds,
                content_type: "product",
                value: totalValue,
                currency: "BDT",
                num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
                order_id: orderId,
            });

            // Track TikTok Pixel
            trackTikTokPixel("CompletePayment", {
                content_ids: contentIds,
                content_type: "product",
                value: totalValue,
                currency: "BDT",
                order_id: orderId,
            });

            // Clear cart and save form data
            cartStorage.clearCart();
            localStorage.setItem("checkout_form", JSON.stringify(values));

            toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে! ✅");

            // Redirect to success page
            router.replace(
                getLink({
                    shopSlug: shop.slug,
                    path: `/order-success?order=${data?.data?.orderSerialNumber}`,
                })
            );
        } catch (error) {
            console.error("Error creating order:", error);
            const errorMessage =
                error instanceof Error ? error.message : "অর্ডার তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formErrors = form.formState.errors;
    console.log("formErrors", formErrors);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="container py-12 max-sm:px-3 lg:py-16">
                    <div className="flex gap-10 max-lg:flex-col lg:gap-16">
                        <div className="w-full lg:w-[55%]">
                            <h2 className="font-medium lg:text-xl">অর্ডার সম্পর্কিত তথ্য</h2>
                            <BillingDetails />
                        </div>
                        <div className="w-full lg:w-[45%]">
                            <h2 className="font-medium lg:text-xl">আপনার অর্ডার</h2>
                            <div className="py-6">
                                <div className="border-foreground/20 flex items-center border-b border-dashed pb-3 max-lg:justify-between max-lg:text-sm lg:pb-4">
                                    <p className="lg:w-[70%]">প্রোডাক্ট</p>
                                    <p className="lg:w-[30%]">সাবটোটাল</p>
                                </div>
                                <div className="overflow-y-auto md:max-h-[50dvh]">
                                    {cartItems.map((item) => (
                                        <div
                                            key={`${item.productId}-${item.selectedVariants[0]?.variantId || "no-variant"}`}
                                            className="flex items-center py-2.5"
                                        >
                                            <div className="flex w-[70%] items-center gap-2">
                                                <Image
                                                    src={item.photoURL || ""}
                                                    alt={item.name || ""}
                                                    width={100}
                                                    height={100}
                                                    className="h-16 w-16 rounded-sm"
                                                />
                                                <div>
                                                    <p>{item.name}</p>
                                                    {item.selectedVariants.length > 0 && (
                                                        <p className="text-muted-foreground text-sm">
                                                            Variant:{" "}
                                                            {item.selectedVariants.map((v) => v.optionName).join(", ")}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-[30%]">
                                                <span>
                                                    {item.quantity} × ৳ {item.price || 0}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-foreground/20 space-y-4 border-y border-dashed py-3 max-lg:text-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="w-[70%]">সাবটোটাল</p>
                                        <p className="w-[30%]">৳ {summary.subtotal.toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="w-[70%]">শিপিং প্রসেস</p>
                                        <p className="w-[30%]">Free Shipping</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 font-medium">
                                    <p className="w-[70%]">টোটাল</p>
                                    <p className="w-[30%]">৳ {summary.total.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-primary/10 p-4 lg:p-6">
                                <h2 className="flex items-center gap-3 pb-4 font-medium lg:text-lg">
                                    <CircleDot className="text-primary size-5" />
                                    ক্যাশঅন ডেলিভারি
                                </h2>
                                <div className="relative flex items-center gap-2 bg-white p-2 px-3 max-lg:text-sm">
                                    <p className="z-20">পন্য হাতে পেয়ে মূল্য পরিশোধ করবেন</p>
                                    <span className="absolute -top-px left-7 z-0 h-4 w-4 -translate-y-1/2 rotate-45 bg-white"></span>
                                </div>
                            </div>

                            <div className="pt-10">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-12 w-full text-base lg:h-14 lg:text-lg"
                                >
                                    {isSubmitting
                                        ? "অর্ডার করা হচ্ছে..."
                                        : `অর্ডার করুন ৳ ${summary.total.toLocaleString()}`}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default Page;
