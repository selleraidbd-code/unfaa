import { Customer } from "@/types/customer-type";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { cn } from "@workspace/ui/lib/utils";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";

export const CustomerCardSkeleton = () => {
    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-8 w-16 rounded" />
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>

                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                </div>

                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </div>
        </div>
    );
};

interface CustomerSelectionCardProps {
    customer: Customer;
    onSelectCustomer: (customer: Customer) => void;
    currentCustomerPhone?: string;
}

export const CustomerSelectionCard = ({
    customer,
    onSelectCustomer,
    currentCustomerPhone,
}: CustomerSelectionCardProps) => {
    const isSelected = currentCustomerPhone === customer.phoneNumber;
    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    {isSelected && (
                        <Badge variant="success" className="text-xs">
                            Selected
                        </Badge>
                    )}
                </div>

                {!isSelected && (
                    <Button
                        size="sm"
                        onClick={() => onSelectCustomer(customer)}
                    >
                        Select
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.phoneNumber}</span>
                </div>

                {customer.email && (
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.email}</span>
                    </div>
                )}

                {customer.address && (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate">
                            {customer.address}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Joined {formatDate(customer.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
};

interface SelectedCustomerCardProps {
    customer: Customer;
    className?: string;
}

export const SelectedCustomerCard = ({
    customer,
    className,
}: SelectedCustomerCardProps) => {
    return (
        <div
            className={cn(
                "border relative rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
                className
            )}
        >
            <Badge
                variant="default"
                className="text-xs absolute top-2 right-2 bg-green-100 text-green-800 border-green-200"
            >
                Selected Customer
            </Badge>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg text-blue-900">
                        {customer.name}
                    </h3>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">
                        {customer.phoneNumber}
                    </span>
                </div>

                {customer.email && (
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">
                            {customer.email}
                        </span>
                    </div>
                )}

                {customer.address && (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700 truncate">
                            {customer.address}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                        Joined {formatDate(customer.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
};
