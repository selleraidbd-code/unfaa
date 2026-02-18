import { z } from "zod";

const faqItemSchema = z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
});

const featureItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
});

export const landingPageFormSchema = z.object({
    name: z.string().min(1, "Please enter a landing page name"),
    contact: z.object({
        whatsappNumber: z.string(),
        facebookPageId: z.string(),
        specialNote: z.string(),
    }),
    faq: z.object({
        title: z.string(),
        subTitle: z.string().optional(),
        items: z.array(faqItemSchema),
    }),
    features: z.object({
        title: z.string(),
        subTitle: z.string().optional(),
        items: z.array(featureItemSchema),
    }),
    testimonials: z.object({
        title: z.string(),
        subTitle: z.string().optional(),
        images: z.array(z.string()),
    }),
    about: z.object({
        title: z.string(),
        subTitle: z.string().optional(),
        imgURL: z.string(), // video or thumbnail URL for right side
        items: z.array(featureItemSchema), // left side list: title + description
    }),
    selectedProductIds: z.array(z.string()),
});

export type LandingPageFormValues = z.infer<typeof landingPageFormSchema>;

export const defaultLandingPageFormValues: LandingPageFormValues = {
    name: "",
    contact: {
        whatsappNumber: "",
        facebookPageId: "",
        specialNote: "",
    },
    faq: {
        title: "",
        subTitle: "",
        items: [{ id: crypto.randomUUID?.() ?? Date.now().toString(), question: "", answer: "" }],
    },
    features: {
        title: "",
        subTitle: "",
        items: [
            {
                id: crypto.randomUUID?.() ?? Date.now().toString(),
                title: "",
                description: "",
            },
        ],
    },
    testimonials: {
        title: "",
        subTitle: "",
        images: [],
    },
    about: {
        title: "",
        subTitle: "",
        imgURL: "",
        items: [
            {
                id: crypto.randomUUID?.() ?? Date.now().toString(),
                title: "",
                description: "",
            },
        ],
    },
    selectedProductIds: [],
};
