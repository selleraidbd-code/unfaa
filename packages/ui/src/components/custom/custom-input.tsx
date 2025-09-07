import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

type CustomInputProps = {
    label?: string;
    placeholder: string;
    description?: string;
    disabled?: boolean;
    type?: "email" | "password" | "text" | "number" | "url";
    value: string | number;
    onChange: (value: string | number) => void;
    required?: boolean;
    min?: number;
    className?: string;
    error?: string;
};

export const CustomInput = ({
    label,
    disabled,
    placeholder,
    type = "text",
    description,
    value,
    onChange,
    required,
    min,
    className = "",
    error,
}: CustomInputProps) => {
    const [show, setShow] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue =
            type === "number" ? Number(e.target.value) : e.target.value;
        onChange(newValue);
    };

    return (
        <div className={`w-full space-y-1 ${className}`}>
            {label && (
                <Label className="gap-1">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                </Label>
            )}
            <div className="relative">
                <Input
                    placeholder={placeholder}
                    type={
                        type === "password"
                            ? show
                                ? "text"
                                : "password"
                            : type
                    }
                    value={
                        type === "number" ? (value ? Number(value) : "") : value
                    }
                    onChange={handleChange}
                    disabled={disabled}
                    min={min}
                    required={required}
                />
                {type === "password" &&
                    (show ? (
                        <Eye
                            onClick={() => setShow((prev) => !prev)}
                            className="absolute right-4 top-[30%] cursor-pointer"
                            size={16}
                        />
                    ) : (
                        <EyeOff
                            onClick={() => setShow((prev) => !prev)}
                            className="absolute right-4 top-[30%] cursor-pointer"
                            size={16}
                        />
                    ))}
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
