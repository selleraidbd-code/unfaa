"use client";

import { cn } from "@workspace/ui/lib/utils";

import { DeliveryZone } from "@/types/product-type";

type Props = {
    zones: DeliveryZone[];
    selectedZoneId: string;
    onZoneChange: (zoneId: string) => void;
};

export const DeliveryZoneSelector = ({ zones, selectedZoneId, onZoneChange }: Props) => {
    if (zones.length === 0) return null;

    return (
        <div className="mb-5 flex flex-row gap-3">
            {zones.map((zone) => (
                <div key={zone.id} className="flex-1">
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
                        className={cn(
                            "flex flex-1 cursor-pointer items-center gap-3.5 rounded-xl border-2 bg-[#eafbea] px-4 py-4 text-lg transition-all duration-200 hover:border-[#0fa54c]",
                            selectedZoneId === zone.id ? "border-[#0fa54c]" : "border-[#eafbea]"
                        )}
                    >
                        <div className="flex flex-col">
                            <h4 className="text-base font-semibold text-[#0fa54c]">{zone.name}</h4>
                            <p className="text-lg font-bold">{zone.fee === 0 ? "0" : zone.fee} টাকা</p>
                        </div>
                    </label>
                </div>
            ))}
        </div>
    );
};
