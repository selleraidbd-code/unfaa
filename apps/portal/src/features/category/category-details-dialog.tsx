import { Button } from "@workspace/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Category } from "@/types/category-type";
import { formatDate } from "@workspace/ui/lib/formateDate";
import Image from "next/image";

export const CategoryDetailsDialog = ({
    selectedCategory,
    setSelectedCategory,
    handleEdit,
}: {
    selectedCategory: Category | null;
    setSelectedCategory: (category: Category | null) => void;
    handleEdit: (category: Category) => void;
}) => {
    return (
        <Dialog
            open={!!selectedCategory}
            onOpenChange={() => setSelectedCategory(null)}
        >
            <DialogContent className="sm:max-w-[500px]">
                {selectedCategory && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{selectedCategory.name}</DialogTitle>
                            <DialogDescription>
                                {selectedCategory.description ||
                                    "No description provided."}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedCategory.thumbnailImg && (
                            <div className="my-4 flex justify-center">
                                <Image
                                    src={selectedCategory.thumbnailImg}
                                    alt={selectedCategory.name}
                                    width={200}
                                    height={200}
                                    className="rounded-md object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-semibold">Keywords:</span>
                                <span className="text-muted-foreground">
                                    {selectedCategory.keywords}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Created:</span>
                                <span className="text-muted-foreground">
                                    {formatDate(selectedCategory.createdAt)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Updated:</span>
                                <span className="text-muted-foreground">
                                    {formatDate(selectedCategory.updatedAt)}
                                </span>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                className="px-6"
                                onClick={() => setSelectedCategory(null)}
                            >
                                Close
                            </Button>
                            <Button
                                className="px-8"
                                onClick={() => handleEdit(selectedCategory)}
                            >
                                Edit
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
