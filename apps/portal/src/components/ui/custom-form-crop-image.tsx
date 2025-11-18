import { Control, FieldValues, Path, PathValue } from "react-hook-form";

import { cn } from "@workspace/ui/lib/utils";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@workspace/ui/components/form";
import { UploadCropImage } from "@/components/file-upload/upload-crop-image";

type TCustomFormCropImage<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    description?: string;
    defaultValue?: PathValue<T, Path<T>>;
    control: Control<T>;
    required?: boolean;
    className?: string;
};

export const CustomFormCropImage = <T extends FieldValues>({
    label,
    name,
    description,
    control,
    defaultValue,
    required,
    className,
}: TCustomFormCropImage<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            rules={{
                required: required ? `${label || name} is required` : false,
            }}
            defaultValue={defaultValue}
            render={({ field, fieldState: { error } }) => (
                <FormItem className={cn("w-full space-y-1", className)}>
                    <FormControl>
                        <UploadCropImage
                            onImageUpload={(url) => {
                                field.onChange(url);
                            }}
                            label={label}
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage>{error?.message}</FormMessage>

                    {/* Preview uploaded image */}
                    {field.value && (
                        <div className="mt-2">
                            <img
                                src={field.value}
                                alt="Uploaded preview"
                                className="w-32 h-32 rounded-lg object-cover border"
                            />
                        </div>
                    )}
                </FormItem>
            )}
        />
    );
};
