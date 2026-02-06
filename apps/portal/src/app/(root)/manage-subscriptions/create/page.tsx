"use client";

import { useRouter } from "next/navigation";

import { useCreateSubscriptionPlanMutation } from "@/redux/api/subscription-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSwitch } from "@workspace/ui/components/custom/custom-form-switch";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CreateSubscriptionPlanPayload } from "@/types/subscription-plan-type";
import { HeaderBackButton } from "@/components/ui/custom-back-button";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().min(0, "Price must be ≥ 0"),
    discountPrice: z.coerce.number().min(0).optional(),
    duration: z.coerce.number().min(1, "Duration is required"),
    durationName: z.string().optional(),
    isFree: z.boolean(),
    isTrial: z.boolean(),
    featuresText: z.string().optional(),
    popular: z.boolean(),
    description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Page = () => {
    const router = useRouter();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            price: 0,
            discountPrice: undefined,
            duration: 30,
            durationName: "",
            isFree: false,
            isTrial: false,
            featuresText: "",
            popular: false,
            description: "",
        },
    });

    const [createPlan, { isLoading }] = useCreateSubscriptionPlanMutation();

    const onSubmit = async (data: FormValues) => {
        const features =
            data.featuresText
                ?.split("\n")
                .map((s) => s.trim())
                .filter(Boolean) ?? [];
        const payload: CreateSubscriptionPlanPayload = {
            name: data.name,
            price: data.price,
            duration: data.duration,
            isFree: data.isFree,
            isTrial: data.isTrial,
            features,
        };
        if (data.discountPrice != null && data.discountPrice > 0) payload.discountPrice = data.discountPrice;
        if (data.durationName) payload.durationName = data.durationName;
        // if (data.popular) payload.popular = data.popular;
        if (data.description) payload.description = data.description;

        await createPlan(payload)
            .unwrap()
            .then(() => {
                toast.success("Subscription plan created");
                router.push("/manage-subscriptions");
            })
            .catch((err: { data?: { message?: string } }) => {
                toast.error(err?.data?.message ?? "Failed to create plan");
            });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mx-auto max-w-2xl space-y-6 rounded-lg border p-6 shadow-sm"
            >
                <HeaderBackButton title="Create Subscription Plan" href="/manage-subscriptions" />
                <div className="grid gap-4 sm:grid-cols-2">
                    <CustomFormInput
                        control={form.control}
                        name="name"
                        label="Plan name"
                        placeholder="e.g. Monthly Plan"
                        required
                    />
                    <CustomFormInput
                        control={form.control}
                        name="durationName"
                        label="Duration label (optional)"
                        placeholder="e.g. 1 Month"
                    />
                    <CustomFormInput
                        control={form.control}
                        name="price"
                        label="Price (৳)"
                        type="number"
                        required
                        placeholder="0"
                    />
                    <CustomFormInput
                        control={form.control}
                        name="discountPrice"
                        label="Discount price (optional)"
                        type="number"
                        placeholder="0"
                    />
                    <CustomFormInput
                        control={form.control}
                        name="duration"
                        label="Duration (days)"
                        type="number"
                        required
                        placeholder="30"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <CustomFormSwitch control={form.control} name="isFree" label="Free plan" />
                    <CustomFormSwitch control={form.control} name="isTrial" label="Trial plan" />
                    {/* <CustomFormSwitch control={form.control} name="popular" label="Mark as popular" /> */}
                </div>

                <CustomFormTextarea
                    control={form.control}
                    name="description"
                    label="Description (optional)"
                    placeholder="e.g. Our most popular plan"
                />

                <CustomFormTextarea
                    control={form.control}
                    name="featuresText"
                    label="Features (one per line)"
                    placeholder="Feature one&#10;Feature two&#10;Feature three"
                    textareaClassName="min-h-[160px] max-h-[320px] scrollbar-thin"
                />
                <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create plan"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push("/manage-subscriptions")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default Page;
