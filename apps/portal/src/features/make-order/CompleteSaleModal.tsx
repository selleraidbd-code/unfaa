import { CheckCircle2, FileText, Plus, Printer } from "lucide-react";

import { Installment } from "@/types/sale-type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Customer } from "@/app/(root)/sales/create/page";

interface CompleteSaleModalProps {
    receiptDialogOpen: boolean;
    setReceiptDialogOpen: (open: boolean) => void;
    orderNumber: string;
    selectedCustomer: Customer | null;
    calculateTotal: () => number;
    isPaid: boolean;
    paymentMethod: string;
    installmentPlan: Installment[];
    handlePrintReceipt: () => void;
    handleDownloadInvoice: () => void;
    createNewOrder: () => void;
}

const CompleteSaleModal = ({
    receiptDialogOpen,
    setReceiptDialogOpen,
    orderNumber,
    selectedCustomer,
    calculateTotal,
    isPaid,
    paymentMethod,
    installmentPlan,
    handlePrintReceipt,
    handleDownloadInvoice,
    createNewOrder,
}: CompleteSaleModalProps) => {
    return (
        <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
            <DialogContent className="w-[35dvw]">
                <DialogHeader>
                    <DialogTitle>Sale Created Successfully</DialogTitle>
                    <DialogDescription>Order #{orderNumber} has been created successfully</DialogDescription>
                </DialogHeader>

                <div className="my-4 border-t border-b py-4">
                    <div className="mb-4 text-center">
                        <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-green-500" />
                        <h3 className="text-xl font-bold">Thank You!</h3>
                        <p className="text-gray-500">Your order has been processed</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Order Number:</span>
                            <span className="font-medium">{orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Customer:</span>
                            <span>{selectedCustomer?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <Badge variant={isPaid ? "default" : "outline"}>
                                {paymentMethod === "installment"
                                    ? "Installment Plan"
                                    : isPaid
                                      ? "Paid"
                                      : "Partially Paid"}
                            </Badge>
                        </div>
                        {paymentMethod === "installment" && (
                            <div className="mt-2 border-t pt-2">
                                <p className="mb-1 text-sm font-medium">Installment Plan:</p>
                                <div className="max-h-32 overflow-y-auto">
                                    {installmentPlan.map((installment: Installment, index: number) => (
                                        <div key={index} className="flex justify-between border-b py-1 text-sm">
                                            <span>
                                                {installment.id}. Due:{" "}
                                                {new Date(installment.dueDate).toLocaleDateString()}
                                            </span>
                                            <div>
                                                <span className="mr-2">
                                                    ${Number.parseFloat(installment.amount.toString()).toFixed(2)}
                                                </span>
                                                <Badge
                                                    variant={installment.status === "paid" ? "default" : "outline"}
                                                    className="text-xs"
                                                >
                                                    {installment.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrintReceipt}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Receipt
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                        <FileText className="mr-2 h-4 w-4" />
                        Download Invoice
                    </Button>
                </div>

                <DialogFooter>
                    <Button onClick={createNewOrder}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Another Order
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CompleteSaleModal;
