"use client";

import { OrderDetailsContent } from "@/features/orders/order-details-content";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@workspace/ui/components/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@workspace/ui/components/drawer";
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
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerTitle className="sr-only">Order Details</DrawerTitle>
                    <DrawerDescription className="sr-only">Edit and manage order information</DrawerDescription>
                    <OrderDetailsContent order={order} onClose={handleClose} />
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto md:max-w-4xl" showCloseButton={false}>
                <DialogTitle className="sr-only">Order Details</DialogTitle>
                <DialogDescription className="sr-only">Edit and manage order information</DialogDescription>
                <OrderDetailsContent order={order} onClose={handleClose} />
            </DialogContent>
        </Dialog>
    );
};
