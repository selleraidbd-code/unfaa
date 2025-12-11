import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form";
import { cn } from "@workspace/ui/lib/utils";
import { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Country } from "react-phone-number-input";

import { PhoneInput } from "@/components/ui/phone-input";

type TCustomFormPhoneInput<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    defaultValue?: PathValue<T, Path<T>>;
    control: Control<T>;
    required?: boolean;
    className?: string;
    international?: boolean;
    defaultCountry?: Country;
};

export const CustomFormPhoneInput = <T extends FieldValues>({
    label,
    disabled,
    name,
    placeholder = "Enter phone number",
    description,
    control,
    defaultValue,
    required,
    className,
    international = true,
    defaultCountry,
}: TCustomFormPhoneInput<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            rules={{
                required: required ? `${label || name} is required` : false,
            }}
            defaultValue={defaultValue}
            render={({ field, fieldState: { error } }) => (
                <FormItem className={cn("h-fit w-full", className)}>
                    {label && (
                        <FormLabel className="gap-1">
                            {label}
                            {required && <span className="text-red-500">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <PhoneInput
                            placeholder={placeholder}
                            {...field}
                            disabled={disabled}
                            required={required}
                            international={international}
                            defaultCountry={defaultCountry}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage>{error?.message}</FormMessage>
                </FormItem>
            )}
        />
    );
};
