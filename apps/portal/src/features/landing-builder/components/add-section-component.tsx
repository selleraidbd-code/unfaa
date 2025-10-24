"use client";

import Image from "next/image";
import { useState } from "react";

import { useGetComponentsQuery } from "@/redux/api/component-api";
import { addNewSection } from "@/redux/slices/landing-page-slice";
import { useAppDispatch } from "@/redux/store/hook";
import { allComponents } from "@workspace/ui/landing/index";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
    Dialog,
    DialogContainer,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { allComponentsTypeOptions } from "@workspace/ui/landing/data";
import type { Component } from "@workspace/ui/landing/types";
import { EComponentType, Section } from "@workspace/ui/landing/types";
import { DataStateHandler } from "@/components/shared/data-state-handler";

export const AddSectionComponent = ({
    type,
}: {
    type?: "navbar" | "footer";
}) => {
    const dispatch = useAppDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedComponentType, setSelectedComponentType] = useState<
        EComponentType | undefined
    >(undefined);
    const [step, setStep] = useState(0);

    const { data, isLoading, isFetching, isError } = useGetComponentsQuery(
        { type: selectedComponentType },
        { skip: !selectedComponentType }
    );

    const handleAddSection = (single: Component) => {
        const compo = allComponents.find(
            (singleCompo) => singleCompo.name === single.name
        );
        console.log("compo :>> ", allComponents);

        if (!compo) return;

        dispatch(
            addNewSection({
                componentInfo: single,
                componentData: compo?.defaultValue as Section,
            })
        );
        setIsOpen(false);
    };

    const Step_1 = (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allComponentsTypeOptions?.map((section) => (
                <div
                    key={section.id}
                    className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg"
                    style={{
                        backgroundImage: `url(http://multi-media-server.naimurrhman.com/uploads/img/1744612373405-488001795.png)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "250px",
                    }}
                    onClick={() => {
                        setSelectedComponentType(
                            section.type as EComponentType
                        );
                        setStep(1);
                    }}
                >
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30 transition-all group-hover:from-black/90" />

                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <div className="text-left">
                            <h3 className="mb-2 text-xl font-bold tracking-tight text-white transition-all group-hover:text-2xl">
                                {section.title}
                            </h3>
                            <p className="text-sm text-white/80 transition-opacity group-hover:opacity-100">
                                {section.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const Step_2 = (
        <DataStateHandler
            data={data?.data}
            isLoading={isLoading || isFetching}
            isError={isError}
            isEmpty={data?.data.length === 0}
        >
            {(componentsData) => (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {componentsData.map((single) => (
                        <div key={single.id}>
                            <button
                                onClick={() => handleAddSection(single)}
                                className="h-full w-full"
                            >
                                <Image
                                    src={single.imgURL}
                                    height={200}
                                    width={300}
                                    className="w-full rounded-lg object-cover"
                                    alt="section as image"
                                ></Image>
                                <span>{single.name}</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </DataStateHandler>
    );

    const allStep = [Step_1, Step_2];
    const titles = ["Select Section", "Select Design"];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="accent"
                    className="w-fit mx-auto capitalize"
                    size="lg"
                >
                    <Plus />
                    {`Add ${type || "Section"}`}
                </Button>
            </DialogTrigger>

            <DialogContent className="lg:max-w-7xl">
                <DialogHeader>
                    <DialogTitle>{titles[step]}</DialogTitle>
                    <DialogDescription className="sr-only">
                        {`Add ${type || "Section"}`}
                    </DialogDescription>
                </DialogHeader>

                <DialogContainer>{allStep[step]}</DialogContainer>

                <DialogFooter className="flex justify-end">
                    {step >= 1 ? (
                        <Button
                            variant="accent"
                            onClick={() => setStep((pre) => pre - 1)}
                        >
                            <ArrowLeft /> Back
                        </Button>
                    ) : null}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
