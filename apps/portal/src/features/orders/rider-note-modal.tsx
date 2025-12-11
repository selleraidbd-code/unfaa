import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { useGetSteadfastRiderNoteQuery } from "@/redux/api/couriar-api";
import { DataStateHandler } from "@/components/shared/data-state-handler";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useState } from "react";
import {
    CustomPagination,
    PaginationMeta,
} from "@/components/ui/custom-pagination";

interface RiderNoteModalProps {
    orderId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const RiderNoteModal = ({
    orderId,
    open,
    onOpenChange,
}: RiderNoteModalProps) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading } = useGetSteadfastRiderNoteQuery(
        {
            orderId: orderId || "",
            page,
            limit,
        },
        {
            skip: !orderId || !open,
        }
    );

    const paginationMeta: PaginationMeta = {
        page: page,
        limit: limit,
        total: data?.meta?.total || 0,
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Rider Notes</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <DataStateHandler
                        data={data}
                        isLoading={isLoading}
                        isEmpty={data?.data?.length === 0}
                        emptyTitle="No notes found"
                        emptyDescription="There are no rider notes for this order."
                    >
                        {(notes) => (
                            <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-4">
                                    {notes?.data?.map((note) => (
                                        <div
                                            key={note.id}
                                            className="border rounded-lg p-3 bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium text-sm text-gray-900">
                                                    {note.deliveryStatus}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDateShortWithTime(
                                                        note.createdAt
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {note.trackingMessage}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </DataStateHandler>
                    <div className="mt-4">
                        <CustomPagination
                            paginationMeta={paginationMeta}
                            showRowsPerPage={false}
                            showRowSelection={false}
                            showPageCount={false}
                            onPageChange={setPage}
                            onLimitChange={setLimit}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
