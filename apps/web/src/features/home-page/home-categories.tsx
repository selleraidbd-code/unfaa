import { ShopThemeCategory } from "@/types/shop-type";
import Image from "next/image";
import Link from "next/link";

export const HomeCategories = ({
    categories,
}: {
    categories: ShopThemeCategory[];
}) => {
    return (
        <section className="container pb-8 sm:pb-12">
            <div>
                <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-6 bg-primary rounded-sm"></span>{" "}
                    <span className="text-lg">Categories</span>
                </p>
                <h2 className="title mt-2">Browse By Category</h2>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 md:gap-6">
                {categories.length === 0 ? (
                    // Show error state
                    <div className="col-span-full text-center py-12">
                        <div className="text-red-500 mb-4">
                            <svg
                                className="w-16 h-16 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                            <p className="text-lg font-medium">
                                No categories found
                            </p>
                        </div>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Retrying...</span>
                            </div>
                        </button>
                    </div>
                ) : (
                    categories.map((category) => (
                        <Link
                            href={`/category/${category.categoryId}`}
                            key={category.id}
                            className="group cursor-pointer rounded-md mt-8 border-1  "
                        >
                            <Image
                                alt="category image"
                                src={
                                    category?.category.thumbnailImg ||
                                    "/placeholder.png"
                                }
                                width={100}
                                height={100}
                                className=" flex w-[50%] h-[50%] mx-auto items-center justify-center mt-5  object-cover  group-hover:transition-all duration-300 group-hover:scale-110"
                            />

                            <h3 className="text-sm text-center mt-4 text-muted-foreground group-hover:text-primary transition-colors duration-300">
                                {category.category.name}
                            </h3>
                        </Link>
                    ))
                )}
            </div>

            {/* Loading indicator */}
            {categories.length === 0 && (
                <div className="text-center mt-8">
                    <div className="inline-flex items-center space-x-2 text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span className="text-sm">Loading categories...</span>
                    </div>
                </div>
            )}
        </section>
    );
};
