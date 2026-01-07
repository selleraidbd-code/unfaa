"use client";

import ComponentFormModal from "@/features/landing-builder/form/component-form-modal";
import { changeSectionPosition, removeSection } from "@/redux/slices/landing-page-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { allComponents } from "@workspace/ui/landing/index";
import { Component, Section } from "@workspace/ui/landing/types";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowDown, ArrowUp, TrashIcon } from "lucide-react";

import { IFieldLabel } from "@/types/landing-page-type";

type Props = {
    componentInfo: Component;
    componentData?: Section;
    index: number;
};

const styles = {
    button: "disabled:cursor-not-allowed disabled:opacity-30",
};
export const ShowSelectedSection = ({ index, componentInfo, componentData }: Props) => {
    const dispatch = useAppDispatch();
    const isEditing = useAppSelector((state) => state.landingPage.isEditing);

    const totalSectionLength = useAppSelector((state) => state.landingPage.landingPageSections.length);

    const selectedComponent = allComponents.find((single) => single.name === componentInfo.name);

    if (!selectedComponent) return <div>Component not found</div>;
    const RenderComponent = selectedComponent.component;

    // if isEditing is true, then show the form builder
    if (!isEditing) {
        return <RenderComponent data={componentData}></RenderComponent>;
    }

    const isUpButtonDisabled = (i: number) => {
        if (i === 0) return true;
        return false;
    };

    const isDownButtonDisabled = (i: number) => {
        if (i === totalSectionLength - 1) return true;
        return false;
    };

    const handleUpButtonClick = () => {
        dispatch(changeSectionPosition({ oldIndex: index, newIndex: index - 1 }));
    };

    const handleDownButtonClick = () => {
        dispatch(changeSectionPosition({ oldIndex: index, newIndex: index + 1 }));
    };

    return (
        <div className="rounded-xl border p-3">
            <div className="border-secondary mb-4 flex justify-between border-b pb-2">
                <div className="flex gap-2 rounded-lg border p-2">
                    <button
                        onClick={handleUpButtonClick}
                        disabled={isUpButtonDisabled(index)}
                        className={cn(styles.button, "cursor-pointer")}
                    >
                        <ArrowUp className="w-[20px]" />
                    </button>
                    <hr className="border-secondary h-full w-px border" />
                    <button
                        onClick={handleDownButtonClick}
                        disabled={isDownButtonDisabled(index)}
                        className={cn(styles.button, "cursor-pointer")}
                    >
                        <ArrowDown className="w-[20px]" />
                    </button>
                </div>
                <div>
                    <div className="flex justify-between gap-2">
                        <Button onClick={() => dispatch(removeSection(index))} variant={"outline"} size={"icon"}>
                            <TrashIcon></TrashIcon>
                        </Button>
                        <ComponentFormModal
                            fieldLabel={(selectedComponent?.fieldLabel || {}) as unknown as IFieldLabel}
                            index={index}
                            componentInfo={componentInfo}
                            componentData={selectedComponent.defaultValue as Section}
                        ></ComponentFormModal>
                    </div>
                </div>
            </div>
            <RenderComponent data={componentData}></RenderComponent>
        </div>
    );
};
