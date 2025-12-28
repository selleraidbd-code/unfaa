"use client";

import { Truck } from "lucide-react";

import { DeliveryZone } from "@/types/product-type";

type Props = {
    zones: DeliveryZone[];
    selectedZoneId: string;
    onZoneChange: (zoneId: string) => void;
};

export const DeliveryZoneSelector = ({ zones, selectedZoneId, onZoneChange }: Props) => {
    return (
        <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-green-600">
                <Truck className="h-6 w-6" />
                ডেলিভারি তথ্য
            </h3>
            <div className="space-y-3">
                {zones.map((zone) => (
                    <div key={zone.id}>
                        <input
                            type="radio"
                            id={`delivery-zone-${zone.id}`}
                            name="delivery-zone"
                            value={zone.id}
                            checked={selectedZoneId === zone.id}
                            onChange={() => onZoneChange(zone.id)}
                            className="hidden"
                        />
                        <label
                            htmlFor={`delivery-zone-${zone.id}`}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border-2 bg-green-50 p-4 transition-all ${
                                selectedZoneId === zone.id ? "border-green-600 bg-green-100" : "border-green-50"
                            } hover:border-green-600`}
                        >
                            <div className="font-bold text-gray-800 capitalize">{zone.name}</div>
                            <div className="text-lg font-bold text-green-600">৳{zone.fee}</div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};
