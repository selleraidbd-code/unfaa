"use client";

import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormImage } from "@/components/ui/custom-form-image";
import { useCreateTutorialMutation } from "@/redux/api/tutorial-api";
import { CreateTutorial } from "@/types/tutorial-type";
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
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@workspace/ui/components/sonner";
import { z } from "zod";

const CreateTutorialFormSchema = z.object({
    imgURL: z.string(),
    title: z.string(),
    description: z.string(),
    videoLink: z.string().optional(),
});

export type TutorialFormValues = z.infer<typeof CreateTutorialFormSchema>;

export const CreateTutorialDialog = () => {
    const [open, setOpen] = useState(false);
    const form = useForm<TutorialFormValues>({
        resolver: zodResolver(CreateTutorialFormSchema),
        defaultValues: {
            title: "",
            imgURL: "",
            description: "",
            videoLink: "",
        },
    });

    const [createTutorial, { isLoading }] = useCreateTutorialMutation();
    const onSubmit = async (data: TutorialFormValues) => {
        console.log("data :>> ", data);

        const payload: CreateTutorial = {
            title: data.title,
            imgURL: data.imgURL,
            description: data.description,
            videoLink: data.videoLink,
        };
        await createTutorial(payload)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Tutorial Upload successfully");
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
                    <Plus className="w-4 h-4" /> Upload Tutorial
                </CustomButton>
            </DialogTrigger>
            <DialogContent className="lg:max-w-2xl">
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
                                Upload Tutorial
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
