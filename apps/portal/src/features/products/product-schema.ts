import { z } from "zod";

export const productVariantOptionSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    sku: z.string().optional(),
    extraPrice: z
        .number({
            invalid_type_error: "Price must be a number",
        })
        .optional(),
    imgUrl: z.string().optional(),
});

export const productVariantOptionSchemaWithId =
    productVariantOptionSchema.extend({
        id: z.string().optional(),
    });

export const productVariantSchema = z.object({
    name: z.string().min(1, { message: "Variant title is required" }),
    isRequired: z.boolean({ required_error: "isRequired is required" }),
    productVariantOptions: z.array(productVariantOptionSchema),
});

export const updateProductVariantSchema = productVariantSchema.extend({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Variant title is required" }),
    isRequired: z.boolean({ required_error: "isRequired is required" }),
    productVariantOptions: z.array(productVariantOptionSchemaWithId),
});

const productBaseSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    banglaName: z.string().min(1, { message: "Bangla name is required" }),
    price: z
        .number({ invalid_type_error: "Price must be a number" })
        .optional(),
    discountPrice: z
        .number({ invalid_type_error: "Discount price must be a number" })
        .optional(),
    photoURL: z.string().min(1, { message: "Product image is required" }),
    images: z.array(z.string()),
    keywords: z.string().min(1, { message: "Keywords are required" }),
    stock: z
        .number({ invalid_type_error: "Stock must be a number" })
        .min(1, { message: "Stock must be positive" }),
    sku: z.string().optional(),
    unitName: z.string().optional(),
    warranty: z.string().optional(),
    categoryIds: z.array(z.string()).min(1),
    brandId: z.string().optional(),
    deliveryId: z.string().optional(),
    description: z.string().min(1, { message: "Description is required" }),
    fullDescription: z
        .string()
        .min(1, { message: "Full description is required" }),
    activeStatus: z.enum(["active", "inactive"]),
});

export const createProductSchema = z.object({
    ...productBaseSchema.shape,
    productVariant: z.array(productVariantSchema),
});

export const updateProductSchema = z.object({
    ...productBaseSchema.shape,
    productVariant: z.array(updateProductVariantSchema),
});
