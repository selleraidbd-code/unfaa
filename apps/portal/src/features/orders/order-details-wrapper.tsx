"use client";

import { OrderDetailsContent } from "@/features/orders/order-details-content";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@workspace/ui/components/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@workspace/ui/components/sheet";
import { useBreakpoint } from "@workspace/ui/hooks/use-breakpoint";

import { Order } from "@/types/order-type";

interface OrderDetailsWrapperProps {
    order: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const OrderDetailsWrapper = ({ order, open, onOpenChange }: OrderDetailsWrapperProps) => {
    const isMobile = useBreakpoint({ size: "lg" });

    const handleClose = () => {
        onOpenChange(false);
    };

    if (isMobile) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="bottom" className="h-[88vh] overflow-y-auto rounded-t-lg p-4">
                    <SheetTitle className="sr-only">Order Details</SheetTitle>
                    <SheetDescription className="sr-only">Edit and manage order information</SheetDescription>
                    <OrderDetailsContent order={order} onClose={handleClose} />
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-6 md:max-w-4xl" showCloseButton={true}>
                <DialogTitle className="sr-only">Order Details</DialogTitle>
                <DialogDescription className="sr-only">Edit and manage order information</DialogDescription>
                <OrderDetailsContent order={order} onClose={handleClose} />
            </DialogContent>
        </Dialog>
    );
};
