"use client";

import { CustomFormImage } from "@/components/ui/custom-form-image";
import { useUpdateTutorialMutation } from "@/redux/api/tutorial-api";
import { CreateTutorial, Tutorial } from "@/types/tutorial-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
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
import { Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@workspace/ui/components/sonner";
import { z } from "zod";
import { CustomButton } from "@/components/ui/custom-button";

const TutorialFormSchema = z.object({
    imgURL: z.string(),
    title: z.string(),
    description: z.string(),
    videoLink: z.string().optional(),
});

type TutorialFormValues = z.infer<typeof TutorialFormSchema>;

export const UpdateTutorialDialog = ({ tutorial }: { tutorial: Tutorial }) => {
    const [open, setOpen] = useState(false);
    const form = useForm<TutorialFormValues>({
        resolver: zodResolver(TutorialFormSchema),
        defaultValues: {
            title: tutorial.title || "",
            imgURL: tutorial.imgURL || "",
            description: tutorial.description || "",
            videoLink: tutorial.videoLink || "",
        },
    });

    const [updateTutorial, { isLoading }] = useUpdateTutorialMutation();
    const onSubmit = async (data: TutorialFormValues) => {
        console.log("data :>> ", data);

        const payload: CreateTutorial = {
            title: data.title,
            imgURL: data.imgURL,
            description: data.description,
            videoLink: data.videoLink,
        };

        const updatedata = {
            id: tutorial.id,
            payload,
        };
        await updateTutorial(updatedata)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Tutorial Update successfully");
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
                <CustomButton>
                    <Upload className="w-2 h-2" /> Upload
                </CustomButton>
            </DialogTrigger>
            <DialogContent className="sm:!w-[80vw] lg:!w-[60vw] xl:!w-[40vw]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">
                        Upload Tutorial
                    </DialogTitle>
                    <DialogDescription>
                        Upload a new Tutorial.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <CustomFormTextarea
                            label="Title"
                            name="title"
                            placeholder="Enter brand name"
                            required={true}
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Duration"
                            name="description"
                            placeholder="Enter brand name"
                            type="text"
                            required={true}
                            control={form.control}
                        />
                        <CustomFormInput
                            label="VideoLink"
                            name="videoLink"
                            placeholder="Enter brand name"
                            type="url"
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
                                <CustomButton type="button" variant="outline">
                                    Cancel
                                </CustomButton>
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
