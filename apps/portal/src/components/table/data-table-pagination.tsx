import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@workspace/ui/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalRows: number;
  maxVisiblePages?: number;
  className?: string;
  buttonClassName?: string;
}

export function DataTablePagination<TData>({
  table,
  totalRows,
  maxVisiblePages = 7,
  className,
  buttonClassName,
}: DataTablePaginationProps<TData>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const setParams = useCallback(
    (params: { [key: string]: string }) => {
      const existingParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          existingParams.set(key, value.toString());
        } else {
          existingParams.delete(key);
        }
      });
      router.replace(`${pathname}?${existingParams.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router, pathname]
  );

  const updatePageParam = (pageIndex: number) => {
    setParams({ page: (pageIndex + 1).toString() });
  };

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to maxVisiblePages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const numMiddlePages = maxVisiblePages - 2; // first and last always shown
    let start = Math.max(2, currentPage - Math.floor(numMiddlePages / 2));
    let end = start + numMiddlePages - 1;

    if (end >= totalPages) {
      end = totalPages - 1;
      start = end - numMiddlePages + 1;
    }
    // Always show first page
    pages.push(1);
    // Add ellipsis if needed
    if (start > 2) {
      pages.push("...");
    }
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push("...");
    }
    // Always show last page
    pages.push(totalPages);
    return pages;
  };

  const handlePaginationLinkClick = (pageNumber: number | string) => {
    if (typeof pageNumber === "number" && pageNumber !== currentPage) {
      const pageIndex = pageNumber - 1;
      table.setPageIndex(pageIndex);
      updatePageParam(pageIndex);
    }
  };

  const handlePreviousClick = () => {
    if (table.getCanPreviousPage()) {
      table.previousPage();
      updatePageParam(table.getState().pagination.pageIndex);
    }
  };

  const handleNextClick = () => {
    if (table.getCanNextPage()) {
      table.nextPage();
      updatePageParam(table.getState().pagination.pageIndex);
    }
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of {totalRows} row(s)
        selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          {/* Previous Page Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousClick}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="size-5" />
          </Button>

          {/* Smart Page Numbers with Ellipsis */}
          <Pagination className={cn("mx-0", className)}>
            <PaginationContent className="gap-2">
              {getVisiblePages().map((pageNumber, index) => (
                <PaginationItem key={index}>
                  {pageNumber === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={pageNumber === currentPage}
                      onClick={() => handlePaginationLinkClick(pageNumber)}
                      className={buttonClassName}
                    >
                      {pageNumber}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>

          {/* Next Page Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextClick}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
