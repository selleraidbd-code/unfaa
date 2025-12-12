"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";
import { Eye, Loader2, RotateCcw, XCircle } from "lucide-react";
import { FaCartShopping, FaTruckFast } from "react-icons/fa6";

import { FraudCheckerData } from "@/types/customer-type";

interface Props {
    fraudState: FraudCheckerData | null;
    error?: string | null;
    onCheckFraud: (phone: string) => void;
    customerPhone: string;
    isChecking?: boolean;
}

export const FraudChecker = ({ fraudState, error, onCheckFraud, customerPhone, isChecking = false }: Props) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);

    const handleConfirmRecheck = (phoneInput: string) => {
        onCheckFraud(phoneInput);
        setShowConfirmDialog(false);
    };

    const summaryStats = fraudState
        ? [
              {
                  icon: FaCartShopping,
                  color: "text-blue-600",
                  value: fraudState.total_parcels,
                  labelBn: "মোট অর্ডার",
                  labelEn: `Total Order`,
              },
              {
                  icon: FaTruckFast,
                  color: "text-green-700",
                  value: fraudState.total_delivered,
                  labelBn: "মোট ডেলিভারি",
                  labelEn: `Total Delivered`,
              },
              {
                  icon: XCircle,
                  color: "text-destructive",
                  value: fraudState.total_cancel,
                  labelBn: "মোট বাতিল",
                  labelEn: `Total Canceled`,
              },
          ]
        : [];

    if (isChecking) {
        return (
            <div className="flex items-center justify-center rounded-lg border p-4 py-12">
                <div className="text-center">
                    <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-gray-600">Checking customer history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center gap-1 rounded-lg border p-4">
                <XCircle className="text-destructive h-6 w-6 flex-shrink-0" />
                <p className="text-destructive text-lg font-medium">Customer Fraud Check Failed</p>
                <p className="text-destructive">{error}</p>
                {customerPhone && <p className="text-destructive text-sm">Phone: {customerPhone}</p>}
            </div>
        );
    }

    return (
        <div>
            {/* Customer Info */}
            {fraudState && (
                <SummaryStats
                    stats={summaryStats}
                    onRecheckClick={() => setShowConfirmDialog(true)}
                    onDetailsClick={() => setShowDetailsDialog(true)}
                />
            )}

            {/* Confirmation Dialog */}
            <RecheckConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                customerPhone={customerPhone}
                onConfirm={handleConfirmRecheck}
                onCancel={() => setShowConfirmDialog(false)}
            />

            {/* Details Dialog */}
            {fraudState && (
                <CourierHistoryDetailsDialog
                    open={showDetailsDialog}
                    onOpenChange={setShowDetailsDialog}
                    fraudState={fraudState}
                />
            )}
        </div>
    );
};

interface SummaryStat {
    icon: React.ElementType;
    color: string;
    value: string | number;
    labelBn: string;
    labelEn: string;
}

interface SummaryStatsProps {
    stats: SummaryStat[];
    onRecheckClick: () => void;
    onDetailsClick: () => void;
}

const SummaryStats = ({ stats, onRecheckClick, onDetailsClick }: SummaryStatsProps) => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                    <div key={index} className="flex items-center gap-5 rounded-lg border p-2 max-sm:flex-col lg:p-4">
                        <Icon className={cn("size-8 flex-shrink-0 max-sm:hidden", stat.color)} />
                        <div className="flex flex-1 flex-col gap-1">
                            <h2 className={cn("text-sm font-medium md:text-base", stat.color)}>{stat.labelBn}</h2>
                            <p className={cn("text-lg font-medium max-md:text-center", stat.color)}>
                                {stat.value}
                            </p>{" "}
                        </div>
                    </div>
                );
            })}

            <div className="flex gap-2 rounded-lg border p-2 max-md:items-center max-md:justify-center md:flex-col">
                <Button size="sm" onClick={onDetailsClick}>
                    <Eye className="h-3 w-3" />
                    <span className="max-md:hidden">Details</span>
                </Button>
                <Button variant="outline" size="sm" onClick={onRecheckClick}>
                    <RotateCcw className="h-3 w-3" />
                    <span className="max-md:hidden">Recheck</span>
                </Button>
            </div>
        </div>
    );
};

interface RecheckConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerPhone: string;
    onConfirm: (phoneInput: string) => void;
    onCancel: () => void;
}

const RecheckConfirmDialog = ({
    open,
    onOpenChange,
    customerPhone,
    onConfirm,
    onCancel,
}: RecheckConfirmDialogProps) => {
    const [phoneInput, setPhoneInput] = useState(customerPhone);

    const handleConfirm = () => {
        onConfirm(phoneInput);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Recheck</DialogTitle>
                    <DialogDescription>
                        Please confirm the phone number to recheck customer verification.
                    </DialogDescription>
                </DialogHeader>

                <CustomInput
                    label="Phone Number"
                    value={phoneInput}
                    onChange={(value) => setPhoneInput(value.toString())}
                    placeholder="Enter phone number"
                    type="tel"
                />

                <DialogFooter className="flex-row justify-center! gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!phoneInput.trim()}>
                        Confirm Recheck
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

interface CourierHistoryDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fraudState: FraudCheckerData;
}

const CourierHistoryDetailsDialog = ({ open, onOpenChange, fraudState }: CourierHistoryDetailsDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Courier History Details</DialogTitle>
                    <DialogDescription>Detailed breakdown of orders by courier service.</DialogDescription>
                </DialogHeader>

                {Object?.keys(fraudState?.apis || {}).length > 0 ? (
                    <div className="overflow-x-auto rounded-md border md:rounded-lg">
                        <table className="w-full text-sm md:text-base">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">কুরিয়ার</th>
                                    <th className="text-primary px-4 py-3 text-center font-medium">অর্ডার</th>
                                    <th className="px-4 py-3 text-center font-medium text-green-700">ডেলিভারি</th>
                                    <th className="text-destructive px-4 py-3 text-center font-medium">বাতিল</th>
                                </tr>
                            </thead>

                            <tbody>
                                {Object.entries(fraudState?.apis || {}).map(([courier, data]) => {
                                    return (
                                        <tr
                                            key={courier}
                                            className="border-b border-dotted last:border-b-0 hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-900">{courier}</td>
                                            <td className="text-primary px-4 py-3 text-center font-medium">
                                                {data.total_parcels}
                                            </td>
                                            <td className="px-4 py-3 text-center font-medium text-green-700">
                                                {data.total_delivered_parcels}
                                            </td>
                                            <td className="px-4 py-3 text-center font-medium text-red-700">
                                                {data.total_cancelled_parcels}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-500">
                        <p>No courier history available.</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
