"use client";

import { useState } from "react";

import EnhancedFormBuilder from "@/features/builder/form/enhanced-form-builder";
import { addDataToSection } from "@/redux/slices/landing-page-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
import { Pen } from "lucide-react";

import { IFieldLabel } from "@/types/site-type";
import { Component, Section } from "@repo/ui/type/index";
import { Button } from "@repo/ui/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/ui/dialog";

type Props = {
    componentInfo: Component;
    componentData?: Section;
    index: number;
    fieldLabel?: IFieldLabel;
};

const ComponentFormModal = (props: Props) => {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const defaultFormValue = useAppSelector(
        (state) =>
            state.landingPage.landingPageSections[props.index]?.componentData
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Pen />
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[600pdx] w-[1200px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit section content</DialogTitle>
                </DialogHeader>
                {/* <div className="hidden space-y-4">
                        {landingSectionsSkeletons.map((section) => (
                            <div
                                onClick={() => handleAddSection(section.key as keyof LANDING_PAGE)}
                                className="cursor-pointer space-y-2"
                                key={section.key}
                            >
                                <h2 className="text-center text-lg font-semibold">
                                    {section.key.split("_").join(" ")}
                                </h2>
                                {section.component}
                            </div>
                        ))}
                    </div> */}
                <div className="">
                    {/* <FormBuilder
                            key={props.index}
                            onSubmit={(data) => {
                                // console.log("data", data);
                                // console.log("props.index", props.index);
                                dispatch(addDataToSection({ index: props.index, componentData: data as ISection }));
                                setIsOpen(false);
                            }}
                            component={props.componentInfo}
                            defaultValue={defaultFormValue}
                        ></FormBuilder> */}
                    <EnhancedFormBuilder
                        onSubmit={(data) => {
                            // console.log("data", data);
                            // console.log("props.index", props.index);
                            dispatch(
                                addDataToSection({
                                    index: props.index,
                                    componentData: data as Section,
                                })
                            );
                            setIsOpen(false);
                        }}
                        fieldLabel={props.fieldLabel}
                        componentValidation={props.componentInfo}
                        defaultValue={defaultFormValue}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ComponentFormModal;
