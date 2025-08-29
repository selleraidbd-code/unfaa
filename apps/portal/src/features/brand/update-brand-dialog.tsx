import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormImage } from "@/components/ui/custom-form-image";
import { useUpdateBrandMutation } from "@/redux/api/brand-api";
import { Brand, UpdateBrand } from "@/types/brand-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const brandFormSchema = z.object({
    name: z.string().min(3, {
        message: "Category name must be at least 3 characters.",
    }),
    imgURL: z.string().optional(),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

export const UpdateBrandDialog = ({
    brand,
    onClose,
}: {
    brand: Brand;
    onClose: () => void;
}) => {
    const form = useForm<BrandFormValues>({
        resolver: zodResolver(brandFormSchema),
        defaultValues: {
            name: brand.name,
            imgURL: brand.imgURL,
        },
    });

    const [updateBrand, { isLoading }] = useUpdateBrandMutation();

    const onSubmit = async (data: BrandFormValues) => {
        const payload: UpdateBrand = {
            id: brand.id,
            payload: {
                name: data.name,
                imgURL: data.imgURL || "",
            },
        };
        await updateBrand(payload)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Brand updated successfully");
                onClose();
            })
            .catch((error) => {
                toast.error(error.data.message || "Brand update failed");
            });
    };

    return (
        <Dialog open={!!brand} onOpenChange={onClose}>
            <DialogContent className="sm:!w-[80vw] lg:!w-[500px]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">
                        Update Brand
                    </DialogTitle>
                    <DialogDescription>
                        Update the brand details.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <CustomFormInput
                            label="Name"
                            name="name"
                            placeholder="Enter brand name"
                            type="text"
                            required={true}
                            control={form.control}
                        />

                        <CustomFormImage
                            label="Image"
                            name="imgURL"
                            control={form.control}
                        />

                        <div className="flex justify-end gap-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <CustomButton type="submit" isLoading={isLoading}>
                                Save Brand
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
