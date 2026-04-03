"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useGetSubscriptionPlanQuery, useUpdateSubscriptionPlanMutation } from "@/redux/api/subscription-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSwitch } from "@workspace/ui/components/custom/custom-form-switch";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { UpdateSubscriptionPlanPayload } from "@/types/subscription-plan-type";
import { HeaderBackButton } from "@/components/ui/custom-back-button";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().min(0, "Price must be ≥ 0"),
    discountPrice: z.coerce.number().min(0).optional(),
    duration: z.coerce.number().min(1, "Duration is required"),
    durationName: z.string().optional(),
    isFree: z.boolean(),
    isTrial: z.boolean(),
    isActive: z.boolean(),
    featuresText: z.string().optional(),
    description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditSubscriptionPlanPage = () => {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { data, isLoading: isLoadingPlan } = useGetSubscriptionPlanQuery(id!, { skip: !id });
    const plan = data?.data;

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
            isActive: true,
            featuresText: "",
            description: "",
        },
    });

    useEffect(() => {
        if (!plan) return;
        form.reset({
            name: plan.name,
            price: plan.price,
            discountPrice: plan.discountPrice ?? undefined,
            duration: plan.duration,
            durationName: plan.durationName ?? "",
            isFree: plan.isFree,
            isTrial: plan.isTrial,
            isActive: plan.isActive,
            featuresText: plan.features?.join("\n") ?? "",
            description: plan.description ?? "",
        });
    }, [plan, form]);

    const [updatePlan, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation();

    const onSubmit = async (data: FormValues) => {
        const features = data.featuresText
            ?.split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
        const payload: UpdateSubscriptionPlanPayload = {
            name: data.name,
            price: data.price,
            duration: data.duration,
            isFree: data.isFree,
            isTrial: data.isTrial,
            isActive: data.isActive,
            features: features ?? [],
        };
        if (data.discountPrice != null && data.discountPrice > 0) {
            payload.discountPrice = data.discountPrice;
        } else {
            payload.discountPrice = 0;
        }
        if (data.durationName !== undefined) payload.durationName = data.durationName;
        if (data.description !== undefined) payload.description = data.description;

        if (!id) return;
        await updatePlan({ id, payload })
            .unwrap()
            .then(() => {
                toast.success("Plan updated");
                router.push("/manage-subscriptions");
            })
            .catch((err: { data?: { message?: string } }) => {
                toast.error(err?.data?.message ?? "Failed to update plan");
            });
    };

    if (!id) return null;
    if (isLoadingPlan || !plan) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">Loading plan...</p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mx-auto max-w-2xl space-y-6 rounded-lg border p-6 shadow-sm"
            >
                <HeaderBackButton title="Edit Subscription Plan" href="/manage-subscriptions" />
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
                        label="Original / discount price (optional)"
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
                    <CustomFormSwitch control={form.control} name="isActive" label="Active plan" />
                    <CustomFormSwitch control={form.control} name="isFree" label="Free plan" />
                    <CustomFormSwitch control={form.control} name="isTrial" label="Trial plan" />
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
                    placeholder="Feature one&#10;Feature two"
                    textareaClassName="min-h-[160px] max-h-[320px] scrollbar-thin"
                />
                <div className="flex gap-2">
                    <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save changes"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push("/manage-subscriptions")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EditSubscriptionPlanPage;
