import { Metadata } from "next";
import Link from "next/link";

import { getOrderBySerialNumber } from "@/actions/order-actions";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { CheckCircle2, Package } from "lucide-react";

import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { AutoRedirect } from "@/components/shared/auto-redirect";

export const metadata: Metadata = {
    title: "Thank you - Order Success",
    description: "Our representative will contact you very soon",
};

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ domain: string }>;
    searchParams: Promise<{ order: string }>;
}) => {
    const { domain } = await params;
    const { order } = await searchParams;

    if (!order) {
        return (
            <CustomErrorOrEmpty
                title="কোন অর্ডার পাওয়া যায়নি"
                description="আপনার অর্ডার পাওয়া যায়নি। দয়া করে আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে কি না তা পরীক্ষা করুন।"
                buttonText="প্রোডাক্টগুলো দেখুন"
                href="/products"
            />
        );
    }

    const orderResponse = await getOrderBySerialNumber(order as string);
    const orderDetails = orderResponse?.data;

    if (!orderDetails) {
        return (
            <CustomErrorOrEmpty
                title="কোন অর্ডার পাওয়া যায়নি"
                description="আপনার অর্ডার পাওয়া যায়নি। দয়া করে আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে কি না তা পরীক্ষা করুন।"
                buttonText="প্রোডাক্টগুলো দেখুন"
                href="/products"
            />
        );
    }

    const total = orderDetails?.discountedPrice || orderDetails?.totalAmount;

    // Format products for display
    const productNames = orderDetails?.orderItems.map((item) => item?.productName).join(", ");
    const packageDetails = orderDetails?.orderItems
        .map((item) => {
            const quantity = item.quantity;
            const variantName = item?.productVariant?.name || "";
            return `${quantity} পিস ${item.productName}${variantName ? ` (${variantName})` : ""}`;
        })
        .join(", ");

    return (
        <div className="min-h-screen bg-white">
            <div className="width py-6 max-sm:px-3 lg:py-12">
                <div className="mx-auto max-w-2xl">
                    {/* Success Icon - Large Green Circle */}
                    <div className="mb-6 flex justify-center">
                        <CheckCircle2 className="size-16 text-green-500 lg:size-20" />
                    </div>

                    {/* Thank You Message */}
                    <div className="mb-6 text-center">
                        <h1 className="mb-3 text-2xl font-bold text-green-600 lg:text-3xl">
                            ধন্যবাদ {orderDetails?.customerName}!
                        </h1>
                        <p className="mb-4 text-sm leading-relaxed text-black md:text-base">
                            আপনি এই বার্তাটি দেখছেন মানে আপনার অর্ডারটি নিশ্চিত হয়েছে। আপনার আর কিছু করতে হবে না। আমরা
                            আপনার অর্ডারটি পেয়েছি, আপনি ২ বা ৩ দিনের মধ্যে এটি পেয়ে যাবেন।
                        </p>
                    </div>

                    {/* Order Number */}
                    <div className="mb-4 text-center">
                        <p className="text-sm text-black md:text-base">
                            অর্ডার নম্বর:{" "}
                            <span className="font-semibold text-green-600">{orderDetails?.orderSerialNumber}</span>
                        </p>
                    </div>

                    {/* Representative Message */}
                    <div className="mb-8 text-center">
                        <p className="text-sm text-black md:text-base">আমাদের একজন প্রতিনিধি অতি শীঘ্রই কল করবে।</p>
                    </div>

                    {/* Order Details Box */}
                    <div className="mb-8 rounded-lg border-2 border-green-200 bg-green-50 p-5 lg:p-6">
                        {/* Header with Package Icon */}
                        <div className="mb-4 flex items-center gap-2 lg:mb-5">
                            <Package className="size-5 text-amber-700 lg:size-6" />
                            <h2 className="text-base font-semibold text-green-600 lg:text-lg">আপনার অর্ডারের বিবরণ</h2>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-3 text-sm md:text-base">
                            <div>
                                <span className="font-semibold text-black">নাম:</span>{" "}
                                <span className="text-black">{orderDetails?.customerName}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-black">ঠিকানা:</span>{" "}
                                <span className="text-black">{orderDetails?.customerAddress}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-black">মোবাইল:</span>{" "}
                                <span className="text-black">{orderDetails?.customerPhoneNumber}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-black">প্রোডাক্ট:</span>{" "}
                                <span className="text-black">{productNames}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-black">প্যাকেজ:</span>{" "}
                                <span className="text-black">{packageDetails}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-black">মূল্য:</span>{" "}
                                <span className="text-black">{total} টাকা</span>
                            </div>
                            <div>
                                <span className="font-semibold text-black">অর্ডার তারিখ:</span>{" "}
                                <span className="text-black">{formatDate(orderDetails?.createdAt ?? "")}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-black">সম্ভাব্য ডেলিভারি:</span>{" "}
                                <span className="text-black">৩-৭ কার্যদিবস</span>
                            </div>
                        </div>
                    </div>

                    {/* Buy More Button */}
                    <div className="flex justify-center">
                        <Link
                            href={`/shop/${domain}`}
                            className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                        >
                            আরো কিনুন
                        </Link>
                    </div>
                </div>
            </div>

            <AutoRedirect href={`/shop/${domain}`} delay={5000} />
        </div>
    );
};

export default Page;
