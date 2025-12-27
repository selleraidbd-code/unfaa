"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { config } from "@/config";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft, ChevronRight, Package, Shield, Tag, Truck } from "lucide-react";

import { CreateOrderPayload, OrderStatus } from "@/types/order-type";
import { Product, ProductVariantOption } from "@/types/product-type";
import { getLink } from "@/lib/get-link";
import { HtmlRenderer } from "@/components/shared/html-renderer";

// const faqs = [
//     { question: "এটি কি নিরাপদ?", answer: "হ্যাঁ, এটি সম্পূর্ণ নিরাপদ এবং শক-প্রুফ বডি সহ আসে।" },
//     { question: "ওয়ারেন্টি কত দিনের?", answer: "১ বছরের ব্র্যান্ড ওয়ারেন্টি রয়েছে।" },
//     { question: "ক্যাশ অন ডেলিভারি আছে কি?", answer: "হ্যাঁ, সম্পূর্ণ বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে।" },
//     { question: "ডেলিভারি কত দিনে?", answer: "ঢাকায় ১-২ দিন এবং ঢাকার বাইরে ৩-৫ দিনে ডেলিভারি।" },
// ];

type Props = {
    product: Product;
    shopSlug: string;
};

export const ProductPageDetails = ({ product, shopSlug }: Props) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariantOption>>({});
    const [formData, setFormData] = useState<{ name: string; address: string; phone: string }>({
        name: "",
        address: "",
        phone: "",
    });
    const [errors, setErrors] = useState<{ name?: string; address?: string; phone?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<string>("");

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
    }, [product]);

    const images = product.images?.length > 0 ? product.images : [product.photoURL];
    const hasDiscount = product.discountPrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const getStockStatus = () => {
        if (product.stock === 0) return { text: "স্টক শেষ", color: "text-red-600", bg: "bg-red-50" };
        if (product.stock < 10)
            return { text: "মাত্র " + product.stock + "টি বাকি!", color: "text-orange-600", bg: "bg-orange-50" };
        return { text: "স্টকে আছে", color: "text-green-600", bg: "bg-green-50" };
    };

    const stockStatus = getStockStatus();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async () => {
        const newErrors: { name?: string; address?: string; phone?: string } = {};

        if (!formData.name.trim()) newErrors.name = "নাম লিখুন";
        if (!formData.address.trim()) newErrors.address = "ঠিকানা লিখুন";

        const clean = formData.phone.replace(/[\s-]/g, "");
        const isValidPhone = /^\+8801[3-9][0-9]{8}$/.test(clean) || /^01[3-9][0-9]{8}$/.test(clean);
        if (!isValidPhone) newErrors.phone = "সঠিক ফোন নাম্বার লিখুন";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Check if product has variants and if they're selected
        if (product.productVariant && product.productVariant.length > 0) {
            for (const variant of product.productVariant) {
                if (variant.isRequired && !selectedVariants[variant.id]) {
                    toast.error(`অনুগ্রহ করে ${variant.name} নির্বাচন করুন`);
                    return;
                }
            }
        }

        setIsSubmitting(true);

        try {
            // Build order item variants
            const orderItemVariant = Object.entries(selectedVariants).map(([variantId, option]) => ({
                productVariantId: variantId,
                productVariantOptionId: option.id,
            }));

            const payload: CreateOrderPayload = {
                shopId: product.shopId,
                customerName: formData.name,
                customerPhoneNumber: formData.phone,
                customerAddress: formData.address,
                deliveryZoneId: selectedDeliveryZone || product?.delivery?.deliveryZones?.[0]?.id || "",
                orderStatus: OrderStatus.PLACED,
                orderItems: [
                    {
                        productId: product.id,
                        quantity: 1,
                        orderItemVariant,
                    },
                ],
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
                throw new Error("Failed to create order");
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

            // Reset form
            setFormData({ name: "", address: "", phone: "" });
            setSelectedVariants({});
            setErrors({});
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("অর্ডার তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            <header className="bg-white shadow-sm">
                <h1 className="px-4 py-6 text-center text-3xl leading-snug font-bold text-red-600">
                    {product.banglaName}
                </h1>
            </header>

            <div className="mx-auto my-6 max-w-3xl rounded-xl bg-white px-4 py-6 shadow-lg">
                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gray-100">
                    {images[0] ? (
                        <>
                            <img
                                src={images[currentImageIndex]}
                                alt={product.name}
                                className="h-full w-full object-contain"
                            />
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`h-2 w-2 rounded-full transition ${
                                                    idx === currentImageIndex ? "w-6 bg-green-600" : "bg-white/60"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Package className="h-24 w-24 text-gray-300" />
                        </div>
                    )}

                    {hasDiscount && (
                        <div className="absolute top-4 right-4 rounded-full bg-red-600 px-3 py-2 font-bold text-white shadow-lg">
                            {discountPercent}% ছাড়
                        </div>
                    )}
                </div>

                <div className="mb-6 rounded-xl bg-green-600 p-6 text-center font-bold text-white">
                    <div className="mb-2 text-lg text-red-100 line-through">
                        নিয়মিত মূল্য: ৳{product.price.toLocaleString()} টাকা
                    </div>
                    <div className="text-2xl">💥 অফার মূল্য: মাত্র ৳{product.discountPrice.toLocaleString()} টাকা!</div>
                    <div
                        className={cn(
                            `mt-3 hidden rounded-full px-4 py-2 text-sm font-semibold ${stockStatus.bg} ${stockStatus.color}`
                        )}
                    >
                        {stockStatus.text}
                    </div>
                </div>

                <div className="mb-4 rounded-xl border-l-6 border-blue-500 bg-blue-50 p-5">
                    <h3 className="mb-3 text-xl font-bold text-blue-600">সংক্ষিপ্ত বিবরণ</h3>
                    <div className="leading-relaxed text-gray-800">{product.description}</div>
                </div>
                {images[1] && <img src={images[1]} alt="Product" className="mb-4 w-full rounded-xl shadow-md" />}

                <div className="mb-4 rounded-xl border-l-6 border-gray-500 bg-gray-100 p-5">
                    <h3 className="mb-3 text-xl font-bold text-gray-700">বিস্তারিত বিবরণ</h3>
                    <HtmlRenderer html={product.fullDescription} />
                </div>
                {images[2] && <img src={images[2]} alt="Product" className="mb-4 w-full rounded-xl shadow-md" />}

                {product.warranty && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl bg-blue-50 p-4">
                        <Shield className="h-6 w-6 flex-shrink-0 text-blue-600" />
                        <div>
                            <div className="text-xs text-gray-600">ওয়ারেন্টি</div>
                            <div className="text-sm font-bold text-gray-800">{product.warranty}</div>
                        </div>
                    </div>
                )}

                <div className="mb-6 rounded-xl bg-gradient-to-r from-red-600 to-red-400 p-2 text-center font-bold text-white md:p-6">
                    <div className="text-lg leading-relaxed">
                        🚚 আপনি রাইডারের সামনে প্রোডাক্ট চেক করে তারপরে রাইডারকে টাকা দিবেন।
                        <br />
                        💰 অগ্রীম এক টাকাও দেয়া লাগবে না!
                    </div>
                </div>

                {/* <div className="mb-8">
                    <h3 className="mb-4 text-center text-2xl font-bold text-green-600">সাধারণ প্রশ্নোত্তর (FAQ) ❓</h3>
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="mb-3 rounded-xl bg-green-50 p-4">
                            <div className="mb-2 font-bold text-gray-800">প্রশ্ন: {faq.question}</div>
                            <div className="text-gray-700">উত্তর: {faq.answer}</div>
                        </div>
                    ))}
                </div> */}

                {product.videoLink && (
                    <div className="mb-6">
                        <h3 className="mb-3 text-xl font-bold text-gray-900">প্রোডাক্ট ভিডিও</h3>
                        <div className="aspect-video overflow-hidden rounded-xl bg-gray-100">
                            <iframe
                                src={product.videoLink}
                                className="h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}

                <h2 className="mb-6 text-center text-3xl font-bold text-red-600">অর্ডার করুন 🛒</h2>

                {product.productVariant && product.productVariant.length > 0 && (
                    <>
                        {product.productVariant.map((variant) => (
                            <div key={variant.id} className="mb-6">
                                <label className="mb-3 block text-lg font-bold text-gray-700">
                                    {variant.name} নির্বাচন করুন:
                                </label>
                                <div
                                    className={
                                        variant.options.some((opt) => opt.imgUrl)
                                            ? "space-y-3"
                                            : "grid grid-cols-2 gap-3"
                                    }
                                >
                                    {variant.options.map((option) => (
                                        <div key={option.id}>
                                            <input
                                                type="radio"
                                                id={`variant-${variant.id}-option-${option.id}`}
                                                name={`variant-${variant.id}`}
                                                value={option.id}
                                                checked={selectedVariants[variant.id]?.id === option.id}
                                                onChange={() =>
                                                    setSelectedVariants({ ...selectedVariants, [variant.id]: option })
                                                }
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor={`variant-${variant.id}-option-${option.id}`}
                                                className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 bg-green-50 p-4 transition-all ${
                                                    selectedVariants[variant.id]?.id === option.id
                                                        ? "border-green-600"
                                                        : "border-green-50"
                                                } hover:border-green-600`}
                                            >
                                                {option.imgUrl && (
                                                    <img
                                                        src={option.imgUrl}
                                                        alt={option.name}
                                                        className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="text-base font-bold text-green-600">
                                                        {option.name}
                                                    </h4>
                                                    {option.extraPrice > 0 && (
                                                        <p className="mt-1 text-lg font-bold text-gray-800">
                                                            💰 অতিরিক্ত ৳{option.extraPrice.toLocaleString()} টাকা
                                                        </p>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                )}

                <div className="mb-6">
                    <h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-green-600">
                        <Truck className="h-6 w-6" />
                        ডেলিভারি তথ্য
                    </h3>
                    <div className="space-y-3">
                        {product.delivery.deliveryZones.map((zone, idx) => (
                            <div key={zone.id}>
                                <input
                                    type="radio"
                                    id={`delivery-zone-${zone.id}`}
                                    name="delivery-zone"
                                    value={zone.id}
                                    checked={selectedDeliveryZone === zone.id}
                                    onChange={() => setSelectedDeliveryZone(zone.id)}
                                    className="hidden"
                                />
                                <label
                                    htmlFor={`delivery-zone-${zone.id}`}
                                    className={`flex cursor-pointer items-center justify-between rounded-xl border-2 bg-green-50 p-4 transition-all ${
                                        selectedDeliveryZone === zone.id
                                            ? "border-green-600 bg-green-100"
                                            : "border-green-50"
                                    } hover:border-green-600`}
                                >
                                    <div className="font-bold text-gray-800 capitalize">{zone.name}</div>
                                    <div className="text-lg font-bold text-green-600">৳{zone.fee}</div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6 space-y-4">
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="আপনার নাম লিখুন"
                            className="w-full rounded-xl border-2 border-gray-300 px-4 py-4 text-lg transition-colors focus:border-green-600 focus:outline-none"
                        />
                        {errors.name && <p className="mt-2 text-sm font-semibold text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="সম্পূর্ণ ঠিকানা (জেলা, থানা ও গ্রামের নাম)"
                            className="w-full rounded-xl border-2 border-gray-300 px-4 py-4 text-lg transition-colors focus:border-green-600 focus:outline-none"
                        />
                        {errors.address && <p className="mt-2 text-sm font-semibold text-red-600">{errors.address}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="সচল মোবাইল নাম্বার (০১XXXXXXXXX)"
                            className="w-full rounded-xl border-2 border-gray-300 px-4 py-4 text-lg transition-colors focus:border-green-600 focus:outline-none"
                        />
                        {errors.phone && <p className="mt-2 text-sm font-semibold text-red-600">{errors.phone}</p>}
                    </div>

                    <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 font-bold">
                        💵 ক্যাশ অন ডেলিভারি: প্রোডাক্ট হাতে পেয়ে টাকা পরিশোধ করবেন।
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-green-600 py-5 text-xl font-bold text-white shadow-lg transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {isSubmitting ? "অর্ডার করা হচ্ছে..." : "এখনই অর্ডার করুন"}
                    </button>
                </div>

                {/* <div className="mt-12 hidden border-t border-gray-200 pt-8">
                    <h2 className="mb-6 text-center text-2xl font-bold">আপনার জন্য আরও প্রোডাক্ট 🔥</h2>

                    <div className="grid grid-cols-2 gap-3">
                        {relatedProducts.map((rp) => (
                            <div
                                key={rp.id}
                                className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg"
                            >
                                <img src={rp.image} alt={rp.banglaName} className="h-44 w-full object-cover" />
                                <div className="p-3">
                                    <h4 className="mb-2 text-sm leading-tight font-bold">{rp.banglaName}</h4>
                                    <p className="text-base">
                                        <span className="font-bold text-green-600">
                                            ৳{rp.discountPrice.toLocaleString()}
                                        </span>{" "}
                                        <small className="text-gray-500 line-through">
                                            ৳{rp.price.toLocaleString()}
                                        </small>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}

                <footer className="mt-8 border-t border-gray-200 pt-6 text-center text-gray-600">
                    <p className="mb-2">
                        <Link href={getLink({ shopSlug, path: "/privacy-policy" })} className="hover:text-green-600">
                            Privacy Policy
                        </Link>{" "}
                        |
                        <Link
                            href={getLink({ shopSlug, path: "/terms-conditions" })}
                            className="ml-2 hover:text-green-600"
                        >
                            Terms & Conditions
                        </Link>
                    </p>
                    <p>
                        © {new Date().getFullYear()} {product.banglaName}
                    </p>
                </footer>
            </div>

            <div className="fixed right-0 bottom-0 left-0 z-50 border-t-2 border-gray-200 bg-white p-3 shadow-2xl md:hidden">
                <div className="mx-auto flex max-w-3xl items-center gap-3">
                    <div className="flex-1">
                        <div className="text-xs text-gray-500">মূল্য</div>
                        <div className="text-xl font-bold text-green-600">
                            ৳{product.discountPrice.toLocaleString()}
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700 active:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {isSubmitting ? "অর্ডার করা হচ্ছে..." : "অর্ডার করুন"}
                    </button>
                </div>
            </div>
        </div>
    );
};
