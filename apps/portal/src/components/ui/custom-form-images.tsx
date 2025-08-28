import { Control, FieldValues, Path, PathValue } from "react-hook-form";

import { cn } from "@workspace/ui/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { FileUpload } from "@/components/file-upload";

type TCustomFormImages<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  defaultValue?: PathValue<T, Path<T>>;
  control: Control<T>;
  required?: boolean;
  className?: string;
  limit?: number;
  isMinimal?: boolean;
};

export const CustomFormImages = <T extends FieldValues>({
  label,
  name,
  description,
  control,
  defaultValue,
  required,
  className,
  limit = 1,
  isMinimal = false,
}: TCustomFormImages<T>) => {
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
            <FileUpload
              onFilesSelected={(files) => {
                if (files.length > 0) {
                  const urls = files.map((file) => file.url).filter(Boolean);
                  field.onChange(urls);
                }
              }}
              initialFiles={
                Array.isArray(field.value)
                  ? field.value
                  : field.value
                    ? [field.value]
                    : []
              }
              label={label}
              limit={limit}
              isMinimal={isMinimal}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
