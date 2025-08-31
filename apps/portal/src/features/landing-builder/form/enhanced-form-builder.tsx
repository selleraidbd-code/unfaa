/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import {
    AlertCircle,
    ChevronDown,
    ChevronUp,
    PlusCircle,
    Trash2,
} from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { FileUpload } from "@/components/file-upload";
import { IFieldLabel } from "@/types/site-type";
import { CustomFormInput } from "@repo/ui/components/custom-ui/custom-form-input";
import { CustomFormTextarea } from "@repo/ui/components/custom-ui/custom-form-textarea";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@repo/ui/components/ui/accordion";
import { Alert, AlertDescription } from "@repo/ui/components/ui/alert";
import { Button } from "@repo/ui/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@repo/ui/components/ui/card";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Form } from "@repo/ui/components/ui/form";
import { Label } from "@repo/ui/components/ui/label";
import { Component, Section, SectionList } from "@repo/ui/type/index";

// Define the field requirement type
type FieldRequirement = "required" | "optional" | "nullable";

// Define the validation structure for a field
// interface FieldValidation {
//     [key: string]: FieldRequirement;
// }

// Define the validation structure for a section list item
// interface SectionListValidation extends FieldValidation {
//     booleanValue: FieldRequirement;
// }

// Define the component validation structure
// interface ComponentValidation {
//     name: string;
//     imgURL: string;
//     type: string;
//     requiredFiled: FieldValidation & {
//         sectionList?: SectionListValidation[];
//     };
// }

// Add a new interface for field labels

type Props = {
    componentValidation: Component;
    onSubmit: (data: Section) => void;
    defaultValue?: Section;
    fieldLabel?: IFieldLabel;
    minItems?: number; // Minimum number of section list items
    maxItems?: number; // Maximum number of section list items
    defaultItemCount?: number; // Default number of section list items to show
};

const EnhancedFormBuilder = (props: Props) => {
    console.log("props", props);
    const {
        componentValidation,
        onSubmit,
        defaultValue,
        fieldLabel = {},
        minItems = 0,
        maxItems,
        defaultItemCount = 0,
    } = props;

    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [sectionListError, setSectionListError] = useState<string | null>(
        null
    );

    // Initialize form with default values or empty values
    const form = useForm<Section>({
        defaultValues: defaultValue || {
            id: "",
            componentName: componentValidation.name,
            title: "",
            subTitle: "",
            description: "",
            customizeDescription: "",
            imgURL: "",
            bgURL: "",
            buttonText: "",
            buttonUrl: "",
            sectionList: [],
            sectionType: componentValidation.type as any,
            index: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = form;

    // Setup field array for sectionList
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "sectionList",
    });

    // Create a default section list item
    const createDefaultItem = (): SectionList => ({
        id: Date.now().toString(),
        title: "",
        subTitle: "",
        description: "",
        customizeDescription: "",
        imgURL: "",
        bgURL: "",
        buttonText: "",
        buttonUrl: "",
        booleanValue: false,
        sectionId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // Add default items when the component mounts
    useEffect(() => {
        // Only add default items if:
        // 1. There are no items yet (fields.length === 0)
        // 2. We have a defaultItemCount > 0
        // 3. We have a sectionList validation
        if (
            fields.length === 0 &&
            defaultItemCount > 0 &&
            componentValidation.requiredFiled.sectionList &&
            componentValidation.requiredFiled.sectionList.length > 0
        ) {
            // Create and add the specified number of default items
            const defaultItems = Array.from(
                { length: defaultItemCount },
                createDefaultItem
            );
            defaultItems.forEach((item) => append(item));

            // Expand all the default items
            setExpandedSections(defaultItems.map((item) => item.id));
        }
    }, [
        append,
        componentValidation.requiredFiled.sectionList,
        defaultItemCount,
        fields.length,
    ]);

    // Custom submit handler with validation
    const onSubmitWithValidation = (data: Section) => {
        // Check if we have the minimum required items
        if (
            hasSectionList &&
            minItems > 0 &&
            data.sectionList.length < minItems
        ) {
            setSectionListError(
                `At least ${minItems} item${minItems !== 1 ? "s" : ""} required`
            );
            return;
        }

        // Clear any previous errors
        setSectionListError(null);

        // Call the original onSubmit
        onSubmit(data);
    };

    // Filter out nullable fields from the main form
    const mainFields = Object.entries(componentValidation.requiredFiled)
        .filter(([key, value]) => key !== "sectionList" && value !== "nullable")
        .reduce(
            (acc, [key, value]) => {
                acc[key] = value as FieldRequirement;
                return acc;
            },
            {} as Record<string, FieldRequirement>
        );

    // Check if a field is required
    const isRequired = (value: FieldRequirement) => value === "required";

    // Toggle section expansion
    const toggleSection = (id: string) => {
        setExpandedSections((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    // Add a new section list item
    const addSectionListItem = () => {
        const newItem = createDefaultItem();
        append(newItem);
        // Expand the newly added section
        setExpandedSections((prev) => [...prev, newItem.id]);
        // Clear any section list error when adding items
        setSectionListError(null);
    };

    // Remove a section list item with validation
    const removeSectionListItem = (index: number) => {
        // Check if removing would violate the minimum requirement
        if (minItems > 0 && fields.length <= minItems) {
            setSectionListError(
                `Cannot remove item. At least ${minItems} item${minItems !== 1 ? "s" : ""} required`
            );
            return;
        }

        // Clear any previous errors
        setSectionListError(null);

        // Remove the item
        remove(index);
    };

    // Move a section list item up
    const moveSectionUp = (index: number) => {
        if (index > 0) {
            move(index, index - 1);
        }
    };

    // Move a section list item down
    const moveSectionDown = (index: number) => {
        if (index < fields.length - 1) {
            move(index, index + 1);
        }
    };

    // Get section list validation if it exists
    const sectionListValidation = (componentValidation.requiredFiled
        .sectionList?.[0] || {}) as SectionList;

    // Check if sectionList is needed
    let hasSectionList =
        componentValidation.requiredFiled.sectionList &&
        componentValidation.requiredFiled.sectionList.length > 0;
    // section list is exist but all filed are nullable
    if (hasSectionList) {
        const allFieldsNames = Object.keys(sectionListValidation);
        const unWantedField = ["id", "sectionId", "createdAt", "updatedAt"];
        const onlyFieldsNames = allFieldsNames.filter((fieldName) => {
            return !unWantedField.includes(fieldName);
        });

        hasSectionList = !Object.keys(sectionListValidation).every(
            (value) =>
                (onlyFieldsNames.includes(value) &&
                    (sectionListValidation[
                        value as keyof typeof sectionListValidation
                    ] as FieldRequirement) === "nullable") ||
                "nullable"
        );
    }

    // Check if we've reached the maximum number of items
    const isMaxItemsReached =
        maxItems !== undefined && fields.length >= maxItems;

    // Update the rendering of form fields to use custom labels
    console.log("componentValidation", errors);
    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmitWithValidation)}
                className="space-y-8"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Main Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Main form fields */}
                            {Object.entries(mainFields).map(
                                ([fieldName, requirement]) => {
                                    // Get custom label if available
                                    const customLabel =
                                        fieldLabel[
                                            fieldName as keyof typeof fieldLabel
                                        ];

                                    // Handle text inputs
                                    if (
                                        [
                                            "title",
                                            "subTitle",
                                            "buttonText",
                                            "buttonUrl",
                                            "customizeDescription",
                                        ].includes(fieldName)
                                    ) {
                                        return (
                                            <CustomFormInput
                                                key={fieldName}
                                                control={control}
                                                required={isRequired(
                                                    requirement
                                                )}
                                                name={
                                                    fieldName as keyof Section
                                                }
                                                label={
                                                    (customLabel ||
                                                        `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, " $1")}`) as string
                                                }
                                                placeholder={`Enter ${fieldName.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                                                // customLabel={}
                                            />
                                        );
                                    }

                                    // // Handle textarea for description
                                    if (fieldName === "description") {
                                        return (
                                            <CustomFormTextarea
                                                key={fieldName}
                                                control={control}
                                                required={isRequired(
                                                    requirement
                                                )}
                                                name="description"
                                                label={
                                                    (customLabel ||
                                                        "Description") as string
                                                }
                                                placeholder="Enter description"
                                                // customLabel={}
                                            />
                                        );
                                    }

                                    // Handle image uploads
                                    if (fieldName === "imgURL") {
                                        return (
                                            // <div
                                            //     key={fieldName}
                                            //     className="grid gap-2"
                                            // >
                                            //     <FileUpload
                                            //         label={
                                            //             (customLabel ||
                                            //                 "Upload Image") as string
                                            //         }
                                            //         setValue={(
                                            //             value: string
                                            //         ) => {
                                            //             setValue(
                                            //                 "imgURL",
                                            //                 value
                                            //             );
                                            //         }}
                                            //         required={isRequired(
                                            //             requirement
                                            //         )}
                                            //     />
                                            //     {watch("imgURL") && (
                                            //         <div className="relative h-40 w-full">
                                            //             <Image
                                            //                 alt="Image preview"
                                            //                 className="rounded-md object-cover"
                                            //                 fill
                                            //                 src={
                                            //                     (watch(
                                            //                         "imgURL"
                                            //                     ) as string) ||
                                            //                     "/placeholder.svg"
                                            //                 }
                                            //             />
                                            //         </div>
                                            //     )}
                                            // </div>
                                            <>
                                                <FileUpload
                                                    initialFiles={[]}
                                                    label={
                                                        (customLabel ||
                                                            "Image") as string
                                                    }
                                                    onFilesSelected={(
                                                        files
                                                    ) => {
                                                        setValue(
                                                            "imgURL",
                                                            files[0]?.url
                                                        );
                                                    }}
                                                    limit={1}
                                                ></FileUpload>
                                            </>
                                        );
                                    }

                                    // Handle background image uploads
                                    if (fieldName === "bgURL") {
                                        return (
                                            <>
                                                <FileUpload
                                                    initialFiles={[]}
                                                    label={
                                                        (customLabel ||
                                                            "Background Image") as string
                                                    }
                                                    onFilesSelected={(
                                                        files
                                                    ) => {
                                                        setValue(
                                                            "imgURL",
                                                            files[0]?.url
                                                        );
                                                    }}
                                                    limit={1}
                                                ></FileUpload>
                                            </>
                                        );
                                    }

                                    return null;
                                }
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Section List */}
                {hasSectionList && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Section Items</CardTitle>
                                {minItems > 0 && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Minimum required: {minItems}{" "}
                                        {maxItems !== undefined &&
                                            `• Maximum allowed: ${maxItems}`}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="button"
                                onClick={addSectionListItem}
                                variant="outline"
                                className="flex items-center gap-2"
                                disabled={isMaxItemsReached}
                            >
                                <PlusCircle className="h-4 w-4" />
                                Add Item
                                {isMaxItemsReached && (
                                    <span className="ml-1">(Max reached)</span>
                                )}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {sectionListError && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {sectionListError}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {fields.length === 0 ? (
                                <div className="py-8 text-center text-gray-500">
                                    No items added yet. Click the &quot;Add
                                    Item&quot; button to add your first item.
                                </div>
                            ) : (
                                <Accordion
                                    type="multiple"
                                    value={expandedSections}
                                    className="space-y-4"
                                >
                                    {fields.map((field, index) => (
                                        <AccordionItem
                                            key={field.id}
                                            value={field.id}
                                            className="overflow-hidden rounded-lg border"
                                        >
                                            <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        Item {index + 1}:{" "}
                                                        {watch(
                                                            `sectionList.${index}.title`
                                                        ) || "Untitled"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            moveSectionUp(index)
                                                        }
                                                        disabled={index === 0}
                                                    >
                                                        <ChevronUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            moveSectionDown(
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            index ===
                                                            fields.length - 1
                                                        }
                                                    >
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            toggleSection(
                                                                field.id
                                                            )
                                                        }
                                                    >
                                                        {expandedSections.includes(
                                                            field.id
                                                        ) ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeSectionListItem(
                                                                index
                                                            )
                                                        }
                                                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                                        disabled={
                                                            minItems > 0 &&
                                                            fields.length <=
                                                                minItems
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <AccordionContent className="p-4">
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    {/* Section list item fields */}
                                                    {Object.entries(
                                                        sectionListValidation
                                                    )
                                                        .filter(
                                                            ([key]) =>
                                                                key in
                                                                    sectionListValidation &&
                                                                sectionListValidation[
                                                                    key as keyof typeof sectionListValidation
                                                                ] !== "nullable"
                                                        )
                                                        .map(
                                                            ([
                                                                fieldName,
                                                                requirement,
                                                            ]) => {
                                                                // Get custom label for section list item if available
                                                                const customLabel =
                                                                    (
                                                                        fieldLabel as any
                                                                    )
                                                                        .sectionList?.[
                                                                        fieldName
                                                                    ];

                                                                // Handle text inputs
                                                                if (
                                                                    [
                                                                        "title",
                                                                        "subTitle",
                                                                        "buttonText",
                                                                        "buttonUrl",
                                                                        "customizeDescription",
                                                                    ].includes(
                                                                        fieldName
                                                                    )
                                                                ) {
                                                                    return (
                                                                        <CustomFormInput
                                                                            key={`${field.id}-${fieldName}`}
                                                                            control={
                                                                                control
                                                                            }
                                                                            required={isRequired(
                                                                                requirement as FieldRequirement
                                                                            )}
                                                                            name={
                                                                                `sectionList.${index}.${fieldName}` as any
                                                                            }
                                                                            label={
                                                                                customLabel ||
                                                                                `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, " $1")}`
                                                                            }
                                                                            placeholder={`Enter ${fieldName.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                                                                            // customLabel={}
                                                                        />
                                                                    );
                                                                }

                                                                // Handle textarea for description
                                                                if (
                                                                    fieldName ===
                                                                    "description"
                                                                ) {
                                                                    return (
                                                                        <CustomFormTextarea
                                                                            key={`${field.id}-${fieldName}`}
                                                                            control={
                                                                                control
                                                                            }
                                                                            required={isRequired(
                                                                                requirement as FieldRequirement
                                                                            )}
                                                                            name={
                                                                                `sectionList.${index}.description` as any
                                                                            }
                                                                            label={
                                                                                customLabel ||
                                                                                "Description"
                                                                            }
                                                                            placeholder="Enter description"
                                                                        />
                                                                    );
                                                                }

                                                                // Handle image uploads
                                                                if (
                                                                    fieldName ===
                                                                    "imgURL"
                                                                ) {
                                                                    return (
                                                                        // <div
                                                                        //     key={`${field.id}-${fieldName}`}
                                                                        //     className="grid gap-2"
                                                                        // >
                                                                        //     <FileUpload
                                                                        //         label={
                                                                        //             customLabel ||
                                                                        //             "Image"
                                                                        //         }
                                                                        //         setValue={(
                                                                        //             value: string
                                                                        //         ) => {
                                                                        //             setValue(
                                                                        //                 `sectionList.${index}.imgURL` as any,
                                                                        //                 value
                                                                        //             );
                                                                        //         }}
                                                                        //         required={isRequired(
                                                                        //             requirement as FieldRequirement
                                                                        //         )}
                                                                        //         // customLabel={}
                                                                        //     />
                                                                        //     {watch(
                                                                        //         `sectionList.${index}.imgURL`
                                                                        //     ) && (
                                                                        //         <div className="relative h-40 w-full">
                                                                        //             <Image
                                                                        //                 alt="Image preview"
                                                                        //                 className="rounded-md object-cover"
                                                                        //                 fill
                                                                        //                 src={
                                                                        //                     (watch(
                                                                        //                         `sectionList.${index}.imgURL`
                                                                        //                     ) as string) ||
                                                                        //                     "/placeholder.svg"
                                                                        //                 }
                                                                        //             />
                                                                        //         </div>
                                                                        //     )}
                                                                        // </div>
                                                                        <div>
                                                                            img
                                                                        </div>
                                                                    );
                                                                }

                                                                // Handle background image uploads
                                                                if (
                                                                    fieldName ===
                                                                    "bgURL"
                                                                ) {
                                                                    return (
                                                                        // <div
                                                                        //     key={`${field.id}-${fieldName}`}
                                                                        //     className="grid gap-2"
                                                                        // >
                                                                        //     <FileUpload
                                                                        //         label={
                                                                        //             customLabel ||
                                                                        //             "Background Image"
                                                                        //         }
                                                                        //         setValue={(
                                                                        //             value: string
                                                                        //         ) => {
                                                                        //             setValue(
                                                                        //                 `sectionList.${index}.bgURL` as any,
                                                                        //                 value
                                                                        //             );
                                                                        //         }}
                                                                        //         required={isRequired(
                                                                        //             requirement as FieldRequirement
                                                                        //         )}
                                                                        //     />
                                                                        //     {watch(
                                                                        //         `sectionList.${index}.bgURL`
                                                                        //     ) && (
                                                                        //         <div className="relative h-40 w-full">
                                                                        //             <Image
                                                                        //                 alt="Background image preview"
                                                                        //                 className="rounded-md object-cover"
                                                                        //                 fill
                                                                        //                 src={
                                                                        //                     (watch(
                                                                        //                         `sectionList.${index}.bgURL`
                                                                        //                     ) as string) ||
                                                                        //                     "/placeholder.svg"
                                                                        //                 }
                                                                        //             />
                                                                        //         </div>
                                                                        //     )}
                                                                        // </div>
                                                                        <div>
                                                                            bg
                                                                        </div>
                                                                    );
                                                                }

                                                                if (
                                                                    fieldName ===
                                                                        "booleanValue" &&
                                                                    (sectionListValidation.booleanValue ===
                                                                        true ||
                                                                        sectionListValidation.booleanValue ===
                                                                            false)
                                                                ) {
                                                                    return (
                                                                        <div
                                                                            key={`${field.id}-${fieldName}`}
                                                                            className="flex items-center space-x-2"
                                                                        >
                                                                            <Controller
                                                                                name={
                                                                                    `sectionList.${index}.booleanValue` as any
                                                                                }
                                                                                control={
                                                                                    control
                                                                                }
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <Checkbox
                                                                                            id={`sectionList.${index}.booleanValue`}
                                                                                            checked={
                                                                                                field.value
                                                                                            }
                                                                                            onCheckedChange={
                                                                                                field.onChange
                                                                                            }
                                                                                            name={
                                                                                                `sectionList.${index}.booleanValue` as any
                                                                                            }
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor={`sectionList.${index}.booleanValue`}
                                                                                        >
                                                                                            {(
                                                                                                fieldLabel as any
                                                                                            )
                                                                                                .sectionList
                                                                                                ?.booleanValue ||
                                                                                                "Boolean Value"}{" "}
                                                                                            {sectionListValidation.booleanValue ===
                                                                                                true && (
                                                                                                <span className="text-red-500">
                                                                                                    *
                                                                                                </span>
                                                                                            )}
                                                                                        </Label>
                                                                                    </div>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    );
                                                                }

                                                                return null;
                                                            }
                                                        )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            )}
                        </CardContent>
                        {fields.length > 0 && (
                            <CardFooter className="flex justify-between border-t pt-4">
                                <div className="text-sm text-gray-500">
                                    {fields.length} item
                                    {fields.length !== 1 ? "s" : ""} added
                                </div>
                                {!isMaxItemsReached && (
                                    <Button
                                        type="button"
                                        onClick={addSectionListItem}
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Add Another Item
                                    </Button>
                                )}
                            </CardFooter>
                        )}
                    </Card>
                )}

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90"
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EnhancedFormBuilder;
