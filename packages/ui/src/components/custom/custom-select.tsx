import { cn } from "@workspace/ui/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";

type CustomSelectProps = {
    label?: string;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    className?: string;
    error?: string;
    options: {
        value: string;
        label: string;
    }[];
};

export const CustomSelect = ({
    label,
    disabled,
    placeholder,
    description,
    value,
    onChange,
    required,
    className = "",
    error,
    options,
}: CustomSelectProps) => {
    return (
        <div className={`w-full space-y-1 ${className}`}>
            {label && <div className="text-sm font-medium">{label}</div>}
            <div className="relative">
                <Select
                    disabled={disabled}
                    onValueChange={onChange}
                    value={value}
                    required={required}
                >
                    <SelectTrigger
                        className={cn("w-full", {
                            "border-destructive": error,
                        })}
                    >
                        <SelectValue
                            placeholder={placeholder || "Select an option"}
                        />
                    </SelectTrigger>
                    <SelectContent className="w-full max-h-[320px] overflow-y-auto min-w-[8rem]">
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {description && (
                <div className="text-[0.8rem] text-muted-foreground">
                    {description}
                </div>
            )}
            {error && (
                <div className="text-sm font-medium text-destructive">
                    {error}
                </div>
            )}
        </div>
    );
};
