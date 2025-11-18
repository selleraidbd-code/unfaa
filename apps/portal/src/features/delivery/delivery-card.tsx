"use client";

import { Delivery } from "@/types/delivery-type";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Truck, Globe, Package, Pencil, Trash, MapPin } from "lucide-react";

interface DeliveryCardProps {
    delivery: Delivery;
    onEdit: (delivery: Delivery) => void;
    onDelete: (id: string) => void;
}

export const DeliveryCard = ({
    delivery,
    onEdit,
    onDelete,
}: DeliveryCardProps) => {
    return (
        <div className="border rounded-lg p-5 space-y-4 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                    <Truck className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="font-semibold text-lg line-clamp-1">
                        {delivery.name}
                    </h3>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onEdit(delivery)}
                        className="h-8 w-8"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onDelete(delivery.id)}
                        className="h-8 w-8 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Scope and Type Badges */}
            <div className="flex gap-2 flex-wrap">
                <Badge
                    variant={
                        delivery.scope === "GLOBAL" ? "default" : "secondary"
                    }
                    className="flex items-center gap-1"
                >
                    {delivery.scope === "GLOBAL" ? (
                        <Globe className="h-3 w-3" />
                    ) : (
                        <Package className="h-3 w-3" />
                    )}
                    {delivery.scope === "GLOBAL"
                        ? "Global"
                        : "Product Specific"}
                </Badge>
                <Badge variant={delivery.isFree ? "success" : "outline"}>
                    {delivery.isFree ? "Free Delivery" : "Paid Delivery"}
                </Badge>
            </div>

            {/* Delivery Zones */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                        Delivery Zones ({delivery.deliveryZones.length})
                    </span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                    {delivery.deliveryZones.map((zone) => (
                        <div
                            key={zone.id}
                            className="flex justify-between items-center p-2 rounded bg-muted/50 text-sm"
                        >
                            <span className="font-medium">{zone.name}</span>
                            <Badge
                                variant={zone.isFree ? "success" : "outline"}
                                className="text-xs"
                            >
                                {zone.isFree ? "Free" : `৳${zone.fee}`}
                            </Badge>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
