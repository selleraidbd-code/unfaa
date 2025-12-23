import { Metadata } from "next";

import { getOrderById } from "@/actions/order-actions";
import { Separator } from "@workspace/ui/components/separator";
import { CheckCircle2 } from "lucide-react";

import { CustomButton } from "@/components/ui/custom-button";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";

export const metadata: Metadata = {
    title: "Thank you - Order Success",
    description: "Our representative will contact you very soon",
};

const Page = async ({ searchParams }: { searchParams: Promise<{ order: string }> }) => {
    const { order } = await searchParams;

    const orderResponse = await getOrderById(order as string);
    const orderDetails = orderResponse?.data;

    const total = orderDetails?.orderItems.reduce(
        (acc, item) =>
            acc +
            (item?.product?.discountPrice ||
                item?.productVariant?.options.reduce((acc, option) => acc + option.extraPrice, 0) ||
                0) *
                item.quantity,
        0
    );

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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("bn-BD", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const orderItems = orderDetails?.orderItems.map((item) => ({
        name: item?.product.banglaName,
        variant: item?.productVariant?.name,
        price:
            item?.product?.discountPrice ||
            item?.productVariant?.options.reduce((acc, option) => acc + option.extraPrice, 0),
        quantity: item?.quantity,
    }));

    return (
        <div className="min-h-screen">
            <div className="width py-6 max-sm:px-3 lg:py-12">
                <div className="flex items-center justify-center">
                    {/* <Logo image={orderDetails?.shop?.photoURL} shopSlug={orderDetails?.shop?.slug} /> */}
                </div>

                <Separator className="bg-foreground/20 my-4 md:mt-6 md:mb-8" />

                <div className="mx-auto max-w-3xl">
                    <div className="flex justify-center max-lg:text-center max-md:flex-col max-md:items-center lg:gap-6">
                        <CheckCircle2 className="text-primary mb-4 size-16 lg:size-24" />
                        <div>
                            <h1 className="text-primary mb-1 text-2xl font-semibold lg:text-3xl">
                                ধন্যবাদ আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে
                            </h1>
                            <p className="mb-8 text-sm md:text-base lg:text-lg">
                                আমাদের একজন প্রতিনিধি খুব শিঘ্রই আপনার সাথে যোগাযোগ করবে
                            </p>
                        </div>
                    </div>

                    <div className="bg-muted mb-2 rounded-lg p-4 lg:p-6">
                        <p className="mb-2 lg:mb-4 lg:text-lg">ধন্যবাদ। আপনার অর্ডারটি সফলভাবে নেওয়া হয়েছে</p>

                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <div>
                                <p className="text-muted-foreground">Order number:</p>
                                <p className="font-medium">{orderDetails?.orderSerialNumber}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Date:</p>

                                <p className="font-medium">{formatDate(orderDetails?.createdAt ?? "")}</p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Total:</p>

                                <p className="font-medium">৳ {total}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Payment method:</p>

                                <p className="font-medium"> ক্যাশঅন ডেলিভারি</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-muted-foreground mb-8">ক্যাশ অন ডেলিভারির সময় টাকা পরিশোধ করুন।</p>

                    <div className="border-border rounded-lg border">
                        <h2 className="border-b p-4 text-lg font-medium">অর্ডার বিবরণ</h2>
                        <div className="p-4">
                            {orderItems?.map((item, index) => (
                                <div key={index} className="flex justify-between py-2">
                                    <div>
                                        <p>
                                            {item?.name} {item?.variant && ` - ${item?.variant} × ${item?.quantity}`}{" "}
                                            {!item?.variant && `× ${item?.quantity}`}
                                        </p>

                                        {item?.variant && (
                                            <p className="text-foreground/80 text-sm">
                                                <span className="font-medium">variant: </span> {item?.variant}
                                            </p>
                                        )}
                                    </div>

                                    <p>৳ {item?.price}</p>
                                </div>
                            ))}
                            <div className="mt-4 border-t pt-4">
                                <div className="flex justify-between py-2">
                                    <p>Subtotal:</p>
                                    <p>৳ {total}</p>
                                </div>
                                <div className="flex justify-between py-2">
                                    <p>Shipping:</p>

                                    <p>Free Shipping</p>
                                </div>
                                <div className="flex justify-between py-2">
                                    <p>Payment method:</p>
                                    <p>ক্যাশ অন ডেলিভারি</p>
                                </div>
                                <div className="flex justify-between py-2 font-medium">
                                    <p>Total:</p>

                                    <p>৳ {total}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <CustomButton href="/products" className="h-12 px-12 text-base">
                            আরও শপিং করুন
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
