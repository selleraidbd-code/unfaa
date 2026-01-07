"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useCreateComponentMutation, useGetComponentQuery } from "@/redux/api/component-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSearchSelect } from "@workspace/ui/components/custom/custom-form-search-select";
import { CustomRadioGroup } from "@workspace/ui/components/custom/custom-radio-group";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { EComponentType } from "@workspace/ui/landing/types";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { FileUpload } from "@/components/file-upload";

enum ERequiredFiled {
    REQUIRED = "required",
    OPTIONAL = "optional",
    NULLABLE = "nullable",
}

const requiredFieldSchema = z.object({
    title: z.enum([ERequiredFiled.REQUIRED, ERequiredFiled.OPTIONAL, ERequiredFiled.NULLABLE]),
    subTitle: z.enum([ERequiredFiled.REQUIRED, ERequiredFiled.OPTIONAL, ERequiredFiled.NULLABLE]),
    description: z.enum([ERequiredFiled.REQUIRED, ERequiredFiled.OPTIONAL, ERequiredFiled.NULLABLE]),
    customizeDescription: z.enum([ERequiredFiled.REQUIRED, ERequiredFiled.OPTIONAL, ERequiredFiled.NULLABLE]),
    buttonText: z.enum([ERequiredFiled.REQUIRED, ERequiredFiled.OPTIONAL, ERequiredFiled.NULLABLE]),
    buttonUrl: z.enum([ERequiredFiled.REQUIRED, ERequiredFiled.OPTIONAL, ERequiredFiled.NULLABLE]),
    imgURL: z.enum([ERequiredFiled.REQUIRED, ERequiredFiled.OPTIONAL, ERequiredFiled.NULLABLE]),
    bgURL: z.enum([ERequiredFiled.REQUIRED, ERequiredFiled.OPTIONAL, ERequiredFiled.NULLABLE]),
});

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    imgURL: z.string().min(1, { message: "Image URL is required" }).optional(),
    type: z.enum([
        EComponentType.BANNER,
        EComponentType.FEATURES,
        EComponentType.TESTIMONIALS,
        EComponentType.PRICING,
        EComponentType.FAQ,
        EComponentType.CTA,
        EComponentType.FOOTER,
        EComponentType.OTHER,
    ]),

    requiredFiled: z.object({
        ...requiredFieldSchema.shape,
        sectionList: z
            .array(
                z.object({
                    ...requiredFieldSchema.shape,
                    booleanValue: z.boolean().optional(),
                })
            )
            .optional(),
    }),
});

export type AddComponentFormSchema = z.infer<typeof formSchema>;

const EditComponent = () => {
    const router = useRouter();
    const { id } = useParams();

    const { data, isLoading: isLoadingComponent } = useGetComponentQuery(id as string);

    const form = useForm<AddComponentFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imgURL: "http://multi-media-server.naimurrhman.com/uploads/img/1744652280636-811302168.png",
            type: EComponentType.BANNER,
            requiredFiled: {
                title: ERequiredFiled.NULLABLE,
                subTitle: ERequiredFiled.NULLABLE,
                description: ERequiredFiled.NULLABLE,
                customizeDescription: ERequiredFiled.NULLABLE,
                buttonText: ERequiredFiled.NULLABLE,
                buttonUrl: ERequiredFiled.NULLABLE,
                imgURL: ERequiredFiled.NULLABLE,
                bgURL: ERequiredFiled.NULLABLE,
                sectionList: [
                    {
                        title: ERequiredFiled.NULLABLE,
                        subTitle: ERequiredFiled.NULLABLE,
                        description: ERequiredFiled.NULLABLE,
                        customizeDescription: ERequiredFiled.NULLABLE,
                        buttonText: ERequiredFiled.NULLABLE,
                        buttonUrl: ERequiredFiled.NULLABLE,
                        imgURL: ERequiredFiled.NULLABLE,
                        bgURL: ERequiredFiled.NULLABLE,
                        booleanValue: false,
                    },
                ],
            },
        },
    });

    const [createComponent, { isLoading }] = useCreateComponentMutation();

    const onSubmit = (data: AddComponentFormSchema) => {
        createComponent(data)
            .unwrap()
            .then(() => {
                toast.success("Component created successfully");
                form.reset();
                router.push("/components");
            })
            .catch((error) => {
                toast.error(error.data.message || "Failed to create component");
            });
    };

    const componentTypes = [
        { value: EComponentType.BANNER, label: "Banner" },
        { value: EComponentType.FEATURES, label: "Features" },
        { value: EComponentType.TESTIMONIALS, label: "Testimonials" },
        { value: EComponentType.PRICING, label: "Pricing" },
        { value: EComponentType.FAQ, label: "FAQ" },
        { value: EComponentType.CTA, label: "CTA" },
        { value: EComponentType.TIMELINE, label: "Timeline" },
        { value: EComponentType.BLOG, label: "Blog" },
        { value: EComponentType.CONTACT, label: "Contact" },
        { value: EComponentType.FOOTER, label: "Footer" },
        { value: EComponentType.OTHER, label: "Others" },
    ];

    const componentFields = [
        { value: "requiredFiled.title", label: "Title" },
        { value: "requiredFiled.subTitle", label: "Subtitle" },
        { value: "requiredFiled.imgURL", label: "Image" },
        { value: "requiredFiled.description", label: "Description" },
        {
            value: "requiredFiled.customizeDescription",
            label: "Customize Description",
        },
        { value: "requiredFiled.buttonText", label: "Button Text" },
        { value: "requiredFiled.buttonUrl", label: "Button URL" },
        { value: "requiredFiled.bgURL", label: "Background Image" },
    ];

    const sectionListFields = [
        { value: "requiredFiled.sectionList.0.title", label: "Title" },
        { value: "requiredFiled.sectionList.0.subTitle", label: "Subtitle" },
        { value: "requiredFiled.sectionList.0.imgURL", label: "Image" },
        {
            value: "requiredFiled.sectionList.0.description",
            label: "Description",
        },
        {
            value: "requiredFiled.sectionList.0.customizeDescription",
            label: "Customize Description",
        },
        {
            value: "requiredFiled.sectionList.0.buttonText",
            label: "Button Text",
        },
        { value: "requiredFiled.sectionList.0.buttonUrl", label: "Button URL" },
        {
            value: "requiredFiled.sectionList.0.bgURL",
            label: "Background Image",
        },
    ];

    const componentFieldsOptions = [
        { value: "required", label: "Required" },
        { value: "optional", label: "Optional" },
        { value: "nullable", label: "Nullable" },
    ];

    const isShowSectionList = form.watch("requiredFiled.sectionList.0.booleanValue");

    useEffect(() => {
        if (data && data.data) {
            form.setValue("name", data.data.name);
            form.setValue("imgURL", data.data.imgURL);
        }
    }, [data]);

    if (isLoadingComponent) {
        return <div>Loading...</div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <HeaderBackButton title="Edit Component" href="/components" />

                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <CustomFormInput
                                label="Name"
                                name="name"
                                placeholder="Enter component name"
                                required
                                control={form.control}
                            />
                            <CustomFormSearchSelect
                                label="Type"
                                name="type"
                                options={componentTypes}
                                placeholder="Select component type"
                                required
                                control={form.control}
                            />
                        </div>

                        <FileUpload limit={1} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {componentFields.map((field) => (
                            <div key={field.value} className="rounded-md border p-4">
                                <CustomRadioGroup
                                    name={field.value as keyof AddComponentFormSchema}
                                    label={field.label}
                                    control={form.control}
                                    options={componentFieldsOptions}
                                    layout="horizontal"
                                />
                            </div>
                        ))}
                    </div>

                    {!isShowSectionList && (
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                onClick={() => form.setValue("requiredFiled.sectionList.0.booleanValue", true)}
                            >
                                Add Section List
                            </Button>
                        </div>
                    )}

                    {isShowSectionList && (
                        <div className="grid grid-cols-2 gap-4">
                            <h2 className="col-span-2 pt-6 text-center text-2xl font-medium">Section List</h2>
                            {sectionListFields.map((field) => (
                                <div key={field.value} className="rounded-md border p-4">
                                    <CustomRadioGroup
                                        name={field.value as keyof AddComponentFormSchema}
                                        label={field.label}
                                        control={form.control}
                                        options={componentFieldsOptions}
                                        layout="horizontal"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add Component"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default EditComponent;
