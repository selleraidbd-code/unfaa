"use client";

import * as React from "react";
import { useState } from "react";

import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Updater,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table";

import { Skeleton } from "@workspace/ui/components/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface BulkAction<TData> {
    label: string;
    onClick: (selectedRows: TData[]) => Promise<void> | void;
    variant?: "default" | "destructive";
    icon?: React.ComponentType<{ className?: string }>;
}

interface PaginationState {
    pageIndex: number;
    pageSize: number;
}

export interface Meta {
    limit: number;
    page: number;
    total: number;
}

export interface FilterableColumn {
    id: string;
    title: string;
    options: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
    isMulti?: boolean;
}

export interface TableCreateButtonInfoProps {
    label: string;
    href?: string;
    onClick?: () => void;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    title?: string;
    isSubtitleShown?: boolean;
    subtitle?: string;
    filterableColumns?: FilterableColumn[];
    onSearch?: (searchTerm: string) => void;
    pagination?: boolean;
    paginationMeta: Meta;
    onPaginationChange?: (state: PaginationState) => void;
    showViewOptions?: boolean;
    createButtonInfo?: TableCreateButtonInfoProps;
    createButton?: React.ReactNode | React.JSX.Element;
    bulkActions?: BulkAction<TData>[];
    isLoading?: boolean;
    isError?: boolean;
    skeletonRows?: number;
    onFilterChange?: (filterId: string, filterValue: string[]) => void;
    onRowClick?: (row: TData) => void;
    onSelectionChange?: (selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    title,
    isSubtitleShown = true,
    subtitle,
    filterableColumns = [],
    onSearch,
    pagination = true,
    paginationMeta,
    onPaginationChange,
    showViewOptions = true,

    createButtonInfo,
    createButton,
    bulkActions = [],
    isLoading = false,
    isError = false,
    skeletonRows = 5,
    onFilterChange,
    onRowClick,
    onSelectionChange,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: paginationMeta.page - 1, // Convert from 1-based to 0-based
        pageSize: paginationMeta.limit,
    });

    const handleRowSelectionChange = (updater: Updater<RowSelectionState>) => {
        setRowSelection(updater);
        setTimeout(() => {
            const selectedRows = table
                .getSelectedRowModel()
                .rows.map((row) => row.original);
            onSelectionChange?.(selectedRows);
        }, 0);
    };

    const table = useReactTable({
        data,
        columns,
        pageCount: paginationMeta
            ? Math.ceil(paginationMeta.total / paginationMeta.limit)
            : -1,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        enableRowSelection: true,
        onRowSelectionChange: handleRowSelectionChange,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: (updater) => {
            const newState =
                typeof updater === "function"
                    ? updater({ pageIndex, pageSize })
                    : updater;
            setPagination(newState);
            onPaginationChange?.(newState);
        },
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);

    const handleBulkAction = async (action: BulkAction<TData>) => {
        await action.onClick(selectedRows);
        setRowSelection({});
    };

    const handleTryAgain = () => {
        window.location.reload();
    };

    if (isError) {
        return (
            <div className="center h-[80dvh] flex-col space-y-4 py-12">
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold">
                        Something went wrong
                    </h3>
                    <p className="text-muted-foreground">
                        There was an error loading the data.
                    </p>
                </div>

                <Button onClick={handleTryAgain}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {title && (
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {title}
                    </h2>
                    {isSubtitleShown && (
                        <p className="text-muted-foreground">
                            {subtitle || `Here's a list of your ${title}!`}
                        </p>
                    )}
                </div>
            )}

            <DataTableToolbar
                table={table}
                filterableColumns={filterableColumns}
                showViewOptions={showViewOptions}
                onSearch={onSearch}
                createButtonInfo={createButtonInfo}
                createButton={createButton}
                bulkActions={bulkActions}
                selectedRows={selectedRows}
                onBulkAction={handleBulkAction}
                onFilterChange={onFilterChange}
            />

            <div className="rounded-md min-h-[60vh] overflow-x-auto border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: skeletonRows }).map(
                                (_, index) => (
                                    <TableRow key={index}>
                                        {Array.from({
                                            length: columns.length,
                                        }).map((_, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                <Skeleton className="h-6 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            )
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    onClick={() => onRowClick?.(row.original)}
                                    className={
                                        onRowClick ? "cursor-pointer" : ""
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && paginationMeta && (
                <DataTablePagination
                    table={table}
                    totalRows={paginationMeta.total}
                    paginationMeta={paginationMeta}
                />
            )}
        </div>
    );
}
