import { Plus } from "lucide-react";

import { CustomItem } from "@/types/order-type";
import { CustomButton } from "@/components/ui/custom-button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

interface AddCustomItemProps {
    customItemDialogOpen: boolean;
    setCustomItemDialogOpen: (open: boolean) => void;
    addCustomItemToOrder: () => void;
    customItem: CustomItem;
    handleCustomItemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddCustomItem = ({
    customItem,
    customItemDialogOpen,
    setCustomItemDialogOpen,
    addCustomItemToOrder,
    handleCustomItemChange,
}: AddCustomItemProps) => {
    return (
        <Dialog
            open={customItemDialogOpen}
            onOpenChange={setCustomItemDialogOpen}
        >
            <DialogTrigger asChild>
                <CustomButton variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Custom Item
                </CustomButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Custom Item</DialogTitle>
                    <DialogDescription>
                        Create a custom product that isn&apos;t in your
                        inventory
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="customName">Item Name</Label>
                        <Input
                            id="customName"
                            name="name"
                            value={customItem.name}
                            onChange={handleCustomItemChange}
                            placeholder="Custom product name"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="customPrice">Price</Label>
                            <Input
                                id="customPrice"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={customItem.price}
                                onChange={handleCustomItemChange}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <Label htmlFor="customQuantity">Quantity</Label>
                            <Input
                                id="customQuantity"
                                name="quantity"
                                type="number"
                                min="1"
                                value={customItem.quantity}
                                onChange={handleCustomItemChange}
                                placeholder="1"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <CustomButton
                        variant="outline"
                        onClick={() => setCustomItemDialogOpen(false)}
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton onClick={addCustomItemToOrder}>
                        Add Item
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
