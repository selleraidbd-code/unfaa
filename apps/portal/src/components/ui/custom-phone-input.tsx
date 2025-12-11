import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { Country, Value } from "react-phone-number-input";

import { PhoneInput } from "@/components/ui/phone-input";

type TCustomPhoneInput = {
    label?: string;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    value?: Value;
    onChange?: (value: Value) => void;
    required?: boolean;
    className?: string;
    international?: boolean;
    defaultCountry?: Country;
    error?: string;
};

export const CustomPhoneInput = ({
    label,
    disabled,
    placeholder = "Enter phone number",
    description,
    value,
    onChange,
    required,
    className,
    international = true,
    defaultCountry = "BD",
    error,
}: TCustomPhoneInput) => {
    return (
        <div className={cn("h-fit w-full space-y-2", className)}>
            {label && (
                <Label className="gap-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </Label>
            )}
            <PhoneInput
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                international={international}
                defaultCountry={defaultCountry}
            />
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
            {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
    );
};
