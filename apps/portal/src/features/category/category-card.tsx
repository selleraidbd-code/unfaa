import { Category } from "@/types/category-type";
import { Button } from "@workspace/ui/components/button";
import { Eye, Pencil, Trash } from "lucide-react";
import Image from "next/image";

export const CategoryCard = ({
    category,
    onEdit,
    onView,
    onDelete,
}: {
    category: Category;
    onEdit?: (category: Category) => void;
    onView?: (category: Category) => void;
    onDelete?: (id: string) => void;
}) => (
    <div className="border rounded-md flex flex-col items-center justify-between gap-2 w-52 p-4 cursor-pointer">
        <Image
            src={category.thumbnailImg || "/placeholder.jpg"}
            alt={category.name}
            width={100}
            height={100}
            className="size-44 object-cover rounded-md"
        />
        <p className="font-semibold text-center">{category.name}</p>
        {(onEdit || onView || onDelete) && (
            <div className="flex justify-end gap-2 items-center">
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEdit?.(category)}
                    disabled={!onEdit}
                >
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onView?.(category)}
                    disabled={!onView}
                >
                    <Eye className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete?.(category.id)}
                    disabled={!onDelete}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                >
                    <Trash className="w-4 h-4" />
                </Button>
            </div>
        )}
    </div>
);
