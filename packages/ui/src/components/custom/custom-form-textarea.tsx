"use client";

import { Control, FieldValues, Path, PathValue } from "react-hook-form";

import { cn } from "@workspace/ui/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Textarea } from "@workspace/ui/components/textarea";

type TCustomFormTextarea<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder: string;
  description?: string;
  disabled?: boolean;
  defaultValue?: PathValue<T, Path<T>>;
  control: Control<T>;
  required?: boolean;
  rows?: number;
  onValueChange?: (value: string) => void;
  className?: string;
};

export const CustomFormTextarea = <T extends FieldValues>({
  label,
  disabled,
  name,
  placeholder,
  description,
  control,
  defaultValue,
  required,
  rows = 4,
  onValueChange,
  className,
}: TCustomFormTextarea<T>) => {
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
          <FormLabel className="title">
            {label}
            {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              {...field}
              value={field.value}
              disabled={disabled}
              className={`pl-4 pr-4`}
              rows={rows}
              onChange={(e) => {
                field.onChange(e.target.value);
                onValueChange?.(e.target.value);
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
