import { Brand } from "@/types/brand-type";
import { Button } from "@workspace/ui/components/button";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";

export const BrandCard = ({
    brand,
    onEdit,
    onDelete,
}: {
    brand: Brand;
    onEdit?: (brand: Brand) => void;
    onDelete?: (id: string) => void;
}) => (
    <div className="border rounded-md flex flex-col items-center justify-between gap-2 w-52 p-4 cursor-pointer">
        <Image
            src={brand.imgURL || "/placeholder.jpg"}
            alt={brand.name}
            width={100}
            height={100}
            className="size-40 object-cover rounded-md"
        />
        <p className="font-semibold text-center">{brand.name}</p>
        {(onEdit || onDelete) && (
            <div className="flex justify-end gap-2 items-center">
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEdit?.(brand)}
                    disabled={!onEdit}
                >
                    <Pencil className="w-4 h-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete?.(brand.id)}
                    disabled={!onDelete}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                >
                    <Trash className="w-4 h-4" />
                </Button>
            </div>
        )}
    </div>
);
