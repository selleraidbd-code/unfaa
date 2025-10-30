"use client";

import { FraudCheckerData } from "@/types/customer-type";
import { Button } from "@workspace/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import {
    AlertCircle,
    CheckCircle,
    Loader2,
    Package,
    RotateCcw,
    ShieldUser,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import { FaPercentage } from "react-icons/fa";
import { FaCartShopping, FaTruckFast } from "react-icons/fa6";

interface Props {
    fraudState: FraudCheckerData | null;
    error?: string | null;
    onCheckFraud: (phone: string) => void;
    customerPhone: string;
    isChecking?: boolean;
}

export const FraudChecker = ({
    fraudState,
    error,
    onCheckFraud,
    customerPhone,
    isChecking = false,
}: Props) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [phoneInput, setPhoneInput] = useState(customerPhone);

    if (!fraudState && !error && !isChecking) {
        return null;
    }

    const handleRecheckClick = () => {
        setPhoneInput(customerPhone);
        setShowConfirmDialog(true);
    };

    const handleConfirmRecheck = () => {
        onCheckFraud(phoneInput);
        setShowConfirmDialog(false);
    };

    const handleCancelRecheck = () => {
        setShowConfirmDialog(false);
        setPhoneInput(customerPhone);
    };

    const deliveryRate = fraudState?.total_parcels
        ? Math.round(
              (fraudState.total_delivered / fraudState.total_parcels) * 100
          )
        : 0;

    const getCustomerStatus = (rate: number) => {
        if (fraudState && fraudState.total_parcels === 0) {
            return {
                icon: Package,
                iconColor: "text-blue-600",
                bgColor: "bg-blue-50 dark:bg-blue-950",
                borderColor: "border-blue-200 dark:border-blue-800",
                title: "New Customer (নতুন গ্রাহক)",
                subtitle: "No delivery history found yet",
            };
        }
        if (rate >= 70) {
            return {
                icon: CheckCircle,
                iconColor: "text-green-600",
                bgColor: "bg-green-50 dark:bg-green-950",
                borderColor: "border-green-200 dark:border-green-800",
                title: "Reliable Customer (এটি একটি নিরাপদ ডেলিভারি। )",
                subtitle: "Excellent delivery record",
            };
        } else if (rate >= 50) {
            return {
                icon: AlertCircle,
                iconColor: "text-yellow-600",
                bgColor: "bg-yellow-50 dark:bg-yellow-950",
                borderColor: "border-yellow-200 dark:border-yellow-800",
                title: "Moderate Risk (এটি একটি মধ্যম রিস্ক ডেলিভারি। )",
                subtitle: "Average delivery rate",
            };
        } else {
            return {
                icon: XCircle,
                iconColor: "text-red-600",
                bgColor: "bg-red-50 dark:bg-red-950",
                borderColor: "border-red-200 dark:border-red-800",
                title: "High Risk Customer (এটি একটি উচ্চ রিস্ক ডেলিভারি। )",
                subtitle: "Low delivery success rate",
            };
        }
    };

    const customerStatus = getCustomerStatus(deliveryRate);
    const StatusIcon = customerStatus.icon;

    const getDeliveryRateColor = (rate: number) => {
        if (rate >= 70) return "text-green-600";
        if (rate >= 50) return "text-yellow-600";
        return "text-red-600";
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
                  color: "text-red-600",
                  value: fraudState.total_cancel,
                  labelBn: "মোট বাতিল",
                  labelEn: `Total Canceled`,
              },
              {
                  icon: FaPercentage,
                  color: fraudState.total_parcels
                      ? getDeliveryRateColor(deliveryRate)
                      : "text-gray-600",
                  value: fraudState.total_parcels ? `${deliveryRate}%` : "N/A",
                  labelBn: "ডেলিভারি রেট",
                  labelEn: `Success Rate`,
              },
          ]
        : [];

    return (
        <div className="space-y-6 bg-card p-4 rounded-xl lg:p-6 max-w-7xl border">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldUser className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">
                        Customer Verification
                    </h2>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRecheckClick}
                    className="flex items-center gap-1"
                >
                    <RotateCcw className="h-3 w-3" />
                    Recheck
                </Button>
            </div>

            {/* Loading State */}
            {isChecking && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
                        <p className="text-sm text-gray-600">
                            Checking customer history...
                        </p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !isChecking && (
                <div className="flex gap-4 p-4 rounded-lg border bg-red-50 border-red-200">
                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-lg font-medium text-red-600 mb-1">
                            Verification Failed
                        </p>
                        <p className="text-red-700">{error}</p>
                        {customerPhone && (
                            <p className="text-sm text-red-600 mt-2">
                                Phone: {customerPhone}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Customer Info */}
            {fraudState && !error && (
                <div className="space-y-6">
                    {/* Customer Status */}
                    <div
                        className={`flex gap-5 p-4 rounded-lg border ${customerStatus.bgColor} ${customerStatus.borderColor}`}
                    >
                        <StatusIcon
                            className={`size-8 ${customerStatus.iconColor}`}
                        />
                        <div className="flex-1">
                            <p
                                className={`text-lg font-medium ${customerStatus.iconColor}`}
                            >
                                {customerStatus.title}
                            </p>
                            <p className="text-gray-500">
                                {customerStatus.subtitle} • Phone:{" "}
                                {fraudState.mobile_number}
                            </p>
                            {deliveryRate > 0 && (
                                <p className="mt-1">
                                    Success Rate: {deliveryRate}%
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <SummaryStats stats={summaryStats} />

                    {/* Courier History Table */}
                    {fraudState &&
                        fraudState.total_parcels > 0 &&
                        Object?.keys(fraudState?.apis || {}).length > 0 && (
                            <div className="overflow-x-auto border rounded-lg p-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-2 font-medium text-gray-700">
                                                কুরিয়ার
                                            </th>
                                            <th className="text-center py-3 px-2 font-medium text-primary">
                                                অর্ডার
                                            </th>
                                            <th className="text-center py-3 px-2 font-medium text-green-700">
                                                ডেলিভারি
                                            </th>
                                            <th className="text-center py-3 px-2 font-medium text-red-600">
                                                বাতিল
                                            </th>
                                            <th
                                                className={cn(
                                                    "text-center py-3 px-2 font-medium",
                                                    getDeliveryRateColor(
                                                        deliveryRate
                                                    )
                                                )}
                                            >
                                                ডেলিভারি %
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Object.entries(
                                            fraudState?.apis || {}
                                        ).map(([courier, data]) => {
                                            const courierDeliveryRate =
                                                data.total_parcels
                                                    ? Math.round(
                                                          (data.total_delivered_parcels /
                                                              data.total_parcels) *
                                                              100
                                                      )
                                                    : 0;

                                            return (
                                                <tr
                                                    key={courier}
                                                    className="border-b last:border-b-0 border-dotted"
                                                >
                                                    <td className="py-3 px-2 font-medium text-gray-900">
                                                        {courier}
                                                    </td>
                                                    <td className="text-center py-3 px-2 text-primary font-medium">
                                                        {data.total_parcels}
                                                    </td>
                                                    <td className="text-center py-3 px-2 text-green-700 font-medium">
                                                        {
                                                            data.total_delivered_parcels
                                                        }
                                                    </td>
                                                    <td className="text-center py-3 px-2 text-red-700 font-medium">
                                                        {
                                                            data.total_cancelled_parcels
                                                        }
                                                    </td>
                                                    <td
                                                        className={cn(
                                                            "text-center py-3 px-2 font-medium",
                                                            getDeliveryRateColor(
                                                                courierDeliveryRate
                                                            )
                                                        )}
                                                    >
                                                        {data.total_parcels > 0
                                                            ? `${courierDeliveryRate}%`
                                                            : "N/A"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </div>
            )}

            {/* Confirmation Dialog */}
            <Dialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Confirm Recheck
                        </DialogTitle>
                        <DialogDescription>
                            Please confirm the phone number to recheck customer
                            verification.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone-input">Phone Number</Label>
                            <Input
                                id="phone-input"
                                type="tel"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value)}
                                placeholder="Enter phone number"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={handleCancelRecheck}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmRecheck}
                            disabled={!phoneInput.trim()}
                        >
                            Confirm Recheck
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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

const SummaryStats = ({ stats }: { stats: SummaryStat[] }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="rounded-lg flex items-center gap-5 border p-4"
                    >
                        <Icon
                            className={`h-8 w-8 mx-auto mb-2 ${stat.color}`}
                        />
                        <div className="flex flex-col gap-1 flex-1">
                            <h2
                                className={cn(
                                    "text-base font-medium",
                                    stat.color
                                )}
                            >
                                {stat.labelBn}
                            </h2>

                            <p className="text-sm">
                                <span
                                    className={cn(
                                        "font-medium pr-1 text-lg",
                                        stat.color
                                    )}
                                >
                                    {stat.value}
                                </span>{" "}
                                {stat.labelEn}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
