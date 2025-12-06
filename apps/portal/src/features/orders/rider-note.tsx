"use client";

import { useGetSteadfastRiderNoteQuery } from "@/redux/api/couriar-api";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import { Clock, FileText } from "lucide-react";

import { DataStateHandler } from "@/components/shared/data-state-handler";

export const RiderNote = () => {
    const { data: riderNoteData, isLoading: isRiderNoteLoading } = useGetSteadfastRiderNoteQuery({
        page: 1,
        limit: 10,
    });

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
                    <div className="space-y-4">
                        {riderNoteData?.data?.map((note) => (
                            <div
                                key={note.id}
                                className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
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
                                <div className="rounded-md bg-gray-50 p-3">
                                    <p className="text-sm whitespace-pre-wrap">{note.trackingMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </DataStateHandler>
    );
};
