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
        <div className="mb-5">
            <div className="flex flex-row gap-3">
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
                                "flex cursor-pointer flex-col items-center justify-center rounded-xl border-[3px] bg-[#eafbea] p-4 transition-all",
                                selectedZoneId === zone.id ? "border-[#0fa54c]" : "border-[#eafbea]",
                                "hover:border-[#0fa54c]"
                            )}
                        >
                            <div className="flex flex-col items-center">
                                <h4 className="mb-2 text-center text-base font-bold text-[#0fa54c] md:text-lg">
                                    {zone.name}
                                </h4>
                                <p className="text-center text-base font-bold text-gray-800 md:text-lg">
                                    {zone.fee === 0 ? "০" : zone.fee} টাকা
                                </p>
                            </div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};
