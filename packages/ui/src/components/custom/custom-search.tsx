import { useState } from "react";

import { Search } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { Input } from "@workspace/ui/components/input";

interface CustomSearchProps {
    value?: string;
    onSearch?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const CustomSearch = ({
    onSearch,
    placeholder,
    className,
    value,
}: CustomSearchProps) => {
    const [searchTerm, setSearchTerm] = useState(value || "");

    const handleSearchTerm = (value: string) => {
        setSearchTerm(value);

        if (value === "") {
            onSearch?.(value);
        }
    };

    const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onSearch?.(searchTerm);
        }
    };

    return (
        <div className={cn("relative w-full md:w-72", className)}>
            <Input
                type="search"
                placeholder={placeholder || "Search here..."}
                value={searchTerm}
                onChange={(event) => handleSearchTerm(event.target.value)}
                onKeyDown={handleSearch}
                className="pl-8"
            />
            <Search className="text-muted-foreground absolute top-[50%] left-2.5 h-4 w-4 -translate-y-1/2" />
        </div>
    );
};
