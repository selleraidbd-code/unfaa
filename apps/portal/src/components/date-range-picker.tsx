"use client";

import * as React from "react";

import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
    dateRange: DateRange | undefined;
    onDateRangeChange: (dateRange: DateRange | undefined) => void;
    className?: string;
}

export function DateRangePicker({ dateRange, onDateRangeChange, className }: DateRangePickerProps) {
    const formatDateRange = (range: DateRange | undefined) => {
        if (!range) return "Select date range";
        if (range.from) {
            if (range.to) {
                return `${formatDate(range.from)} - ${formatDate(range.to)}`;
            }
            return formatDate(range.from);
        }
        return "Select date range";
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleReset = () => {
        onDateRangeChange(undefined);
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            "justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground",
                            "h-9 w-[260px]"
                        )}
                    >
                        <CalendarIcon className="mr-2 size-4" />
                        <span>{formatDateRange(dateRange)}</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={onDateRangeChange}
                        numberOfMonths={2}
                        disabled={(date) => date > new Date() || date < new Date("2020-01-01")}
                    />
                </PopoverContent>
            </Popover>
            {dateRange && (
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 px-2 lg:px-3">
                    Reset
                </Button>
            )}
        </div>
    );
}
