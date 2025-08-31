"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import { cn } from "@workspace/ui/lib/utils";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form";
import {
    RadioGroup,
    RadioGroupItem,
} from "@workspace/ui/components/radio-group";

type TCustomFormInput<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    options: {
        value: string;
        label: string;
    }[];
    layout?: "horizontal" | "vertical";
};

const CustomRadioGroup = <T extends FieldValues>({
    name,
    label,
    control,
    options,
    layout = "vertical",
}: TCustomFormInput<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className={cn(
                                "flex flex-col gap-1",
                                layout === "horizontal" && "flex-row gap-4"
                            )}
                        >
                            {options.map((option) => (
                                <FormItem
                                    key={option.value}
                                    className="flex items-center space-x-2 space-y-0"
                                >
                                    <FormControl>
                                        <RadioGroupItem value={option.value} />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-normal">
                                        {option.label}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default CustomRadioGroup;
