import { z } from "zod";

export const productSchema = z.object({
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
    description: z.string().min(1, { message: "Description is required" }),
    fullDescription: z
        .string()
        .min(1, { message: "Full description is required" }),
    productVariant: z.array(
        z.object({
            title: z.string().min(1, { message: "Variant title is required" }),
            isRequired: z
                .boolean({ required_error: "isRequired is required" })
                .optional(),
            options: z.array(
                z.object({
                    name: z.string().min(1, { message: "Name is required" }),
                    sku: z.string().optional(),
                    extraPrice: z
                        .number({
                            invalid_type_error: "Price must be a number",
                        })
                        .optional(),
                    imageURL: z.string().optional(),
                })
            ),
            isMandatory: z.boolean().optional(),
        })
    ),
    activeStatus: z.enum(["active", "inactive"]),
});
