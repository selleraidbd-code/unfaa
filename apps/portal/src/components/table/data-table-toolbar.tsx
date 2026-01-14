"use client";

import type { Table } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronDown, Plus, X } from "lucide-react";

import { CustomButton } from "@/components/ui/custom-button";

import { FilterableColumn, TableCreateButtonInfoProps } from "./data-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface BulkAction<TData> {
    label: string;
    onClick: (selectedRows: TData[]) => void;
    variant?: "default" | "destructive";
    icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterableColumns?: FilterableColumn[];
    showViewOptions?: boolean;
    onSearch?: (searchTerm: string) => void;
    createButtonInfo?: TableCreateButtonInfoProps;
    createButton?: React.ReactNode | React.JSX.Element;
    bulkActions?: BulkAction<TData>[];
    selectedRows: TData[];
    onBulkAction: (action: BulkAction<TData>) => Promise<void>;
    onFilterChange?: (filterId: string, filterValue: string[]) => void;
}

export function DataTableToolbar<TData>({
    table,
    filterableColumns = [],
    showViewOptions,
    onSearch,
    createButtonInfo,
    createButton,
    bulkActions = [],
    selectedRows,
    onBulkAction,
    onFilterChange,
}: DataTableToolbarProps<TData>) {
    const handleReset = () => {
        table.resetColumnFilters();
        table.resetRowSelection();
        if (onSearch) {
            onSearch("");
        }
    };

    const isFiltered = table.getState().columnFilters.length > 0;
    const hasSelection = selectedRows.length > 0;

    const handleFilterChange = (columnId: string, selectedValues: string[]) => {
        table.getColumn(columnId)?.setFilterValue(selectedValues);
        onFilterChange?.(columnId, selectedValues);
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {onSearch && (
                    // <Input
                    //     type="search"
                    //     placeholder="Search..."
                    //     value={searchTerm}
                    //     onChange={(event) =>
                    //         handleSearchTerm(event.target.value)
                    //     }
                    //     onKeyDown={handleSearch}
                    //     className="w-[150px] lg:w-[250px]"
                    // />
                    <CustomSearch onSearch={onSearch} placeholder="Search..." className="w-[150px] lg:w-[250px]" />
                )}
                {filterableColumns.length > 0 &&
                    filterableColumns.map((column) => {
                        const tableColumn = table.getColumn(column.id);
                        if (!tableColumn) return null;

                        return (
                            <DataTableFacetedFilter
                                key={column.id}
                                column={tableColumn}
                                title={column.title}
                                options={column.options}
                                isMulti={column.isMulti}
                                onFilterChange={(values) => handleFilterChange(column.id, values)}
                            />
                        );
                    })}

                {bulkActions.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-4 h-8" disabled={!hasSelection}>
                                Actions
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[160px]">
                            {hasSelection && (
                                <>
                                    {bulkActions.map((action, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                            onClick={() => onBulkAction(action)}
                                            className={cn(
                                                "cursor-pointer",
                                                action.variant === "destructive"
                                                    ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    : ""
                                            )}
                                        >
                                            {action.icon && <action.icon className="h-4 w-4" />}
                                            {action.label}
                                        </DropdownMenuItem>
                                    ))}
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {(isFiltered || hasSelection) && (
                    <Button variant="ghost" onClick={handleReset}>
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {showViewOptions && <DataTableViewOptions table={table} />}
                {createButtonInfo && (
                    <CustomButton onClick={createButtonInfo.onClick} href={createButtonInfo.href}>
                        <Plus className="h-4 w-4" />
                        {createButtonInfo.label}
                    </CustomButton>
                )}
                {createButton}
            </div>
        </div>
    );
}
