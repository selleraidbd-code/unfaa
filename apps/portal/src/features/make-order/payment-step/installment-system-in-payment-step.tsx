import { InstallmentPlanEditor } from "@/features/sales/installment-plan-editor";
import { AlertCircle } from "lucide-react";

import { Installment } from "@/types/sale-type";

interface InstallmentSystemInPaymentStepProps {
    installmentPlan: Installment[];
    handleInstallmentPlanChange: (installmentPlan: Installment[]) => void;
    calculateTotal: () => number;
}

export const InstallmentSystemInPaymentStep = ({
    installmentPlan,
    handleInstallmentPlanChange,
    calculateTotal,
}: InstallmentSystemInPaymentStepProps) => {
    return (
        <div className="rounded-md border p-4">
            <InstallmentPlanEditor
                totalAmount={calculateTotal()}
                initialInstallments={installmentPlan}
                onChange={handleInstallmentPlanChange}
            />

            <div className="mt-4 border-t pt-4">
                <div className="mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <p className="text-sm font-medium text-orange-700">Important Information</p>
                </div>
                <ul className="list-disc space-y-1 pl-6 text-sm text-gray-600">
                    <li>First installment will be marked as paid when the order is completed</li>
                    <li>All installments must be paid in cash</li>
                    <li>Make sure the total installment amount equals the order total</li>
                </ul>
            </div>
        </div>
    );
};
