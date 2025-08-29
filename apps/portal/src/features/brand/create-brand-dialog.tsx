"use client";

import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormImage } from "@/components/ui/custom-form-image";
import useGetUser from "@/hooks/useGetUser";
import { useCreateBrandMutation } from "@/redux/api/brand-api";
import { CreateBrand } from "@/types/brand-type";
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
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const brandFormSchema = z.object({
    name: z.string().min(2, {
        message: "Brand name must be at least 2 characters.",
    }),
    imgURL: z.string(),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

export const CreateBrandDialog = () => {
    const user = useGetUser();
    const [open, setOpen] = useState(false);
    const form = useForm<BrandFormValues>({
        resolver: zodResolver(brandFormSchema),
        defaultValues: {
            name: "",
            imgURL: "",
        },
    });

    const [createBrand, { isLoading }] = useCreateBrandMutation();

    const onSubmit = async (data: BrandFormValues) => {
        if (!user) {
            toast.error("User not found");
            return;
        }

        const payload: CreateBrand = {
            name: data.name,
            imgURL: data.imgURL,
            shopId: user.shop.id,
        };
        await createBrand(payload)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Brand created successfully");
                setOpen(false);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message);
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4" /> Create Brand
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:!w-[80vw] lg:!w-[60vw] xl:!w-[40vw]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">
                        Create Brand
                    </DialogTitle>
                    <DialogDescription>
                        Create a new brand for your shop.
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
