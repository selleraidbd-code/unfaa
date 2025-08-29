"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@workspace/ui/components/button";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
        >
            {theme === "dark" ? (
                <Sun className="h-[1rem] w-[1rem]" />
            ) : (
                <Moon className="h-[1rem] w-[1rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
