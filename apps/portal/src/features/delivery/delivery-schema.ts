import { z } from "zod";

export const deliveryZoneSchema = z.object({
    name: z.string().min(1, { message: "Zone name is required" }),
    fee: z
        .number({
            invalid_type_error: "Fee must be a number",
        })
        .min(0, { message: "Fee must be 0 or greater" }),
    isFree: z.boolean(),
});

export const updateDeliveryZoneSchema = deliveryZoneSchema.extend({
    id: z.string().optional(),
});

export const deliveryFormSchema = z.object({
    name: z.string().min(1, { message: "Delivery name is required" }),
    scope: z.enum(["GLOBAL", "PRODUCT_SPECIFIC"], {
        required_error: "Scope is required",
    }),
    isFree: z.boolean(),
    deliveryZones: z
        .array(deliveryZoneSchema)
        .min(1, { message: "At least one delivery zone is required" }),
});

export const updateDeliveryFormSchema = z.object({
    name: z.string().min(1, { message: "Delivery name is required" }),
    scope: z.enum(["GLOBAL", "PRODUCT_SPECIFIC"], {
        required_error: "Scope is required",
    }),
    isFree: z.boolean(),
    deliveryZones: z
        .array(updateDeliveryZoneSchema)
        .min(1, { message: "At least one delivery zone is required" }),
});

export type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;
export type UpdateDeliveryFormValues = z.infer<typeof updateDeliveryFormSchema>;
