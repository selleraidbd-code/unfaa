"use client";

import { DataStateHandler } from "@/components/shared/data-state-handler";
import { useGetSteadfastRiderNoteQuery } from "@/redux/api/couriar-api";
import { Button } from "@workspace/ui/components/button";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import { Clock, FileText } from "lucide-react";

export const RiderNote = () => {
    const { data: riderNoteData, isLoading: isRiderNoteLoading } =
        useGetSteadfastRiderNoteQuery({
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
                                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FileText className="h-4 w-4" />
                                        <span>
                                            Note ID: {note.id.slice(0, 8)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Clock className="h-3 w-3" />
                                        <span>
                                            {formatDateShortWithTime(
                                                note.createdAt
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-md p-3">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {note.riderNote}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </DataStateHandler>
    );
};
