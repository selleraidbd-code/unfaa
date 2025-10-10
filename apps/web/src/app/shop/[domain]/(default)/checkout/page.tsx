"use client";

import { useEffect, useState } from "react";

import BillingDetails from "@/features/checkout/BillingDetails";
import { CircleDot } from "lucide-react";

import { makeOrder } from "@/actions/order-actions";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { useShop } from "@/contexts/shop-context";
import { getLink } from "@/lib/get-link";
import { CartItem, cartStorage } from "@/lib/cart";
import { CreateOrderPayload, OrderStatus } from "@/types/order-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
        const cartItems = cartStorage.getCart();

        const orderItems = cartItems?.map((item: CartItem) => ({
            productId: item.productId,
            quantity: item.quantity,
            orderItemVariant: item.selectedVariants.map((variant) => ({
                productVariantId: variant.variantId,
                productVariantOptionId: variant.optionId,
            })),
        }));

        const order: CreateOrderPayload = {
            shopId: shop.id,
            orderItems,
            customerName: values.name,
            customerPhoneNumber: values.phone,
            customerAddress: values.address,
            deliveryZoneId: values.deliveryZoneId,
            orderStatus: OrderStatus.PLACED,
        };

        await makeOrder(order).then((res) => {
            cartStorage.clearCart();
            localStorage.setItem("checkout_form", JSON.stringify(values));
            router.replace(
                getLink({
                    shopSlug: shop.slug,
                    path: `/order-success?order=${res?.data?.id}`,
                })
            );
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="container py-12 max-sm:px-3 lg:py-16">
                    <div className="flex gap-10 max-lg:flex-col lg:gap-16">
                        <div className="w-full lg:w-[55%]">
                            <h2 className="font-medium lg:text-xl">
                                অর্ডার সম্পর্কিত তথ্য
                            </h2>
                            <BillingDetails />
                        </div>
                        <div className="w-full lg:w-[45%]">
                            <h2 className="font-medium lg:text-xl">
                                আপনার অর্ডার
                            </h2>
                            <div className="py-6">
                                <div className="flex items-center border-b border-dashed border-foreground/20 pb-3 max-lg:justify-between max-lg:text-sm lg:pb-4">
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
                                                    {item.selectedVariants
                                                        .length > 0 && (
                                                        <p className="text-sm text-muted-foreground">
                                                            Variant:{" "}
                                                            {item.selectedVariants
                                                                .map(
                                                                    (v) =>
                                                                        v.optionName
                                                                )
                                                                .join(", ")}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-[30%]">
                                                <span>
                                                    {item.quantity} × ৳{" "}
                                                    {item.price || 0}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 border-y border-dashed border-foreground/20 py-3 max-lg:text-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="w-[70%]">সাবটোটাল</p>
                                        <p className="w-[30%]">
                                            ৳{" "}
                                            {summary.subtotal.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="w-[70%]">শিপিং প্রসেস</p>
                                        <p className="w-[30%]">Free Shipping</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 font-medium">
                                    <p className="w-[70%]">টোটাল</p>
                                    <p className="w-[30%]">
                                        ৳ {summary.total.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-primary/10 p-4 lg:p-6">
                                <h2 className="flex items-center gap-3 pb-4 font-medium lg:text-lg">
                                    <CircleDot className="size-5 text-primary" />
                                    ক্যাশঅন ডেলিভারি
                                </h2>
                                <div className="relative flex items-center gap-2 bg-white p-2 px-3 max-lg:text-sm">
                                    <p className="z-20">
                                        পন্য হাতে পেয়ে মূল্য পরিশোধ করবেন
                                    </p>
                                    <span className="absolute -top-px left-7 z-0 h-4 w-4 -translate-y-1/2 rotate-45 bg-white"></span>
                                </div>
                            </div>

                            <div className="pt-10">
                                <Button
                                    type="submit"
                                    className="h-12 w-full text-base lg:h-14 lg:text-lg"
                                >
                                    অর্ডার করুন ৳{" "}
                                    {summary.total.toLocaleString()}
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
