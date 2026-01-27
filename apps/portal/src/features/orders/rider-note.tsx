"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useGetSteadfastRiderNoteQuery } from "@/redux/api/couriar-api";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import { Clock, FileText } from "lucide-react";

import { CustomPagination, PaginationMeta } from "@/components/ui/custom-pagination";
import { DataStateHandler } from "@/components/shared/data-state-handler";

export const RiderNote = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 30;

    const { data: riderNoteData, isLoading: isRiderNoteLoading } = useGetSteadfastRiderNoteQuery({
        page: Number(page),
        limit: Number(limit),
        searchTerm: "Parcel",
    });

    const paginationMeta: PaginationMeta = {
        page: Number(page),
        limit: Number(limit),
        total: riderNoteData?.meta?.total || 0,
    };

    const updateSearchParams = (key: string, value: string | number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value.toString());

        // Always reset page to 1 unless we're updating the page itself
        if (key !== "page") {
            params.set("page", "1");
        }

        router.push(`?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        updateSearchParams("page", page);
    };

    const handleLimitChange = (limit: number) => {
        updateSearchParams("limit", limit);
    };

    return (
        <DataStateHandler
            data={riderNoteData}
            isLoading={isRiderNoteLoading}
            isEmpty={riderNoteData?.data?.length === 0}
            emptyTitle="No rider notes found"
            emptyDescription="No rider notes found"
            emptyClassName="text-center py-12"
        >
            {(riderNoteData) => (
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        Total Rider Notes: {riderNoteData?.meta?.total || 0}
                    </div>
                    <div className="mb-4 space-y-4">
                        {riderNoteData?.data?.map((note) => (
                            <div
                                key={note.id}
                                className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="text-muted-foreground h-4 w-4" />
                                        <div>
                                            <div className="text-sm font-medium">
                                                Consignment ID: {note.consignmentId}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                        <Clock className="h-3 w-3" />
                                        <span>{formatDateShortWithTime(note.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="rounded-md bg-muted/30 p-3">
                                    <p className="text-sm whitespace-pre-wrap">{note.trackingMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <CustomPagination
                        className="justify-center"
                        paginationMeta={paginationMeta}
                        showRowsPerPage={false}
                        showRowSelection={false}
                        showPageCount={false}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                    />
                </>
            )}
        </DataStateHandler>
    );
};
