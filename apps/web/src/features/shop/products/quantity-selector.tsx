import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
    quantity: number;
    onQuantityDecrease: () => void;
    onQuantityIncrease: () => void;
}

export const QuantitySelector = ({
    quantity,
    onQuantityDecrease,
    onQuantityIncrease,
}: QuantitySelectorProps) => {
    return (
        <div className="flex items-center bg-primary h-10 w-fit rounded-full px-3 gap-0.5 text-white">
            <button onClick={onQuantityDecrease}>
                <Minus className="size-5 lg:size-6" />
            </button>
            <span className="w-12 text-center text-sm lg:text-base">
                {quantity}
            </span>
            <button onClick={onQuantityIncrease}>
                <Plus className="size-5 lg:size-6" />
            </button>
        </div>
    );
};
