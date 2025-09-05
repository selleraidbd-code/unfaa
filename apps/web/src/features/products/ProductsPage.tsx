"use client";

import Link from "next/link";
import { HomeIcon, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";

import { useState } from "react";
import { Product } from "@/types/product-type";
import { ProductCard } from "@/features/home-page/product-card";

type ProductsPageProps = {
  products: Product[];
};
export const ProductsPage = ({ products }: ProductsPageProps) => {
  console.log("products :>> ", products);

  const categories = [
    "Makeup",
    "Skincare",
    "Haircare",
    "Fragrances",
    "Bath & Body",
    "Men's Grooming",
    "Beauty Tools & Accessories",
    "Wellness & Self-Care",
  ];

  const sizes = [
    "30ml",
    "100ml",
    "50ml",
    "200ml",
    "300ml",
    "500ml",
    "250ml",
    "5 pcs",
    "10 pcs",
  ];

  const colors = [
    "Rose Pink",
    "Hot Pink",
    "Soft Aqua",
    "Mint Blue",
    "Violet",
    "Peach",
  ];
  const [selectedSort, setSelectedSort] = useState("High to Low");
  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
  };
  const clearSort = () => {
    setSelectedSort("");
  };
  return (
    <div className="container mx-auto px-4 py-6 ">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <HomeIcon className="w-4 h-4" />
        <Link href="#" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <span>Products</span>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-[250px_1fr] gap-10">
        {/* Sidebar */}
        <aside className="space-y-6">
          <Accordion type="multiple" className="" defaultValue={["category"]}>
            <AccordionItem value="category">
              <AccordionTrigger className="text-base font-semibold  py-1">
                Category
              </AccordionTrigger>
              <AccordionContent className=" pb-4 grid gap-4 border-b border-muted-foreground mt-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox className="text-muted-foreground" id={category} />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="multiple" defaultValue={["size"]}>
            <AccordionItem value="size">
              <AccordionTrigger className="text-base font-semibold py-1">
                Size
              </AccordionTrigger>
              <AccordionContent className=" pb-4 grid gap-4 border-b border-muted-foreground mt-2">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox id={size} />
                    <label
                      htmlFor={size}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="multiple" defaultValue={["color"]}>
            <AccordionItem value="color">
              <AccordionTrigger className="text-base font-semibold  py-2 ">
                Color
              </AccordionTrigger>
              <AccordionContent className=" pb-4 grid gap-4 border-b border-muted-foreground mt-2">
                {colors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox id={color} />
                    <label
                      htmlFor={color}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {color}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>

        {/* Main Content */}
        <main>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              Total Products: {products.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort By:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 px-3 text-sm bg-transparent flex items-center gap-2"
                  >
                    {selectedSort || "Sort"}
                    {selectedSort && (
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents dropdown from opening
                          clearSort();
                        }}
                      />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleSortChange("Low to High")}
                  >
                    Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("High to Low")}
                  >
                    High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("Newest Arrivals")}
                  >
                    Newest Arrivals
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Link href={"/products/id"}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </Link>
        </main>
      </div>
    </div>
  );
};
