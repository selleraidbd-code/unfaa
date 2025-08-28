import { Badge } from "@workspace/ui/components/badge";
import { CardContent } from "@workspace/ui/components/card";
import Image from "next/image";

interface ProductCardProps {
  imageSrc: string;
  discount?: string;
  category: string;
  title: string;
  currentPrice: number;
  originalPrice?: number;
}

export const ProductCard = ({
  imageSrc,
  discount,
  category,
  title,
  currentPrice,
  originalPrice,
}: ProductCardProps) => {
  return (
    <div className="relative overflow-hidden cursor-pointer rounded-lg shadow-sm border border-transparent hover:shadow-md hover:border-purple-500 hover:scale-[1.02] transition duration-300 ease-in-out group">
      {discount && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-sm z-10">
          {discount}
        </div>
      )}
      <CardContent className="p-0">
        <div className="relative w-full aspect-[4/3] mb-2 overflow-hidden border-b border-gray-200 group-hover:border-purple-500">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-3 space-y-3">
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-700 hover:bg-red-100"
          >
            {category}
          </Badge>
          <h3 className="text-sm font-medium leading-tight line-clamp-2 min-h-[2.5rem] transition-colors group-hover:text-black">
            {title}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-semibold text-red-600 transition-colors group-hover:text-red-700">
              ৳ {currentPrice}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                ৳ {originalPrice}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </div>
  );
};
