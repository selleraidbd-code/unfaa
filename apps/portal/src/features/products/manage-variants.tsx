import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Product } from "@/types/product-type";

export const ManageVariants = ({ product }: { product: Product }) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Manage Variants</Button>
            </DialogTrigger>

            <DialogContent className="lg:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Manage Variants</DialogTitle>
                    <DialogDescription>
                        You can manage the variants of the product here.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    {product.productVariant.map((variant) => (
                        <div key={variant.id}>
                            <h3>{variant.name}</h3>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
