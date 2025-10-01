import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Component, Section } from "@workspace/ui/landing/types";

export interface LandingPageState {
    landingPageSections: {
        componentInfo: Component;
        componentData?: Section;
    }[];
    landingPageData: {
        name: string;
        keyword: string;
        imgUrl: string;
        category: string;
    };
    isEditing: boolean;
}

const initialState: LandingPageState = {
    landingPageSections: [],
    landingPageData: {
        name: "",
        keyword: "",
        imgUrl: "",
        category: "",
    },
    isEditing: true,
};

const landingPageSlice = createSlice({
    name: "landingPage",
    initialState,
    reducers: {
        setLandingPageSection: (state, action) => {
            state.landingPageSections = action.payload;
        },
        clearLandingPage: (state) => {
            state.landingPageSections = [];
            state.isEditing = false;
        },
        setLandingPageData: (
            state,
            action: PayloadAction<{
                fieldName: "name" | "keyword" | "imgUrl" | "category";
                value: string;
            }>
        ) => {
            state.landingPageData[action.payload.fieldName] =
                action.payload.value;
        },
        addNewSection: (
            state,
            action: PayloadAction<{
                componentInfo: Component;
                componentData?: Section;
            }>
        ) => {
            state.landingPageSections.push(action.payload);
        },
        setEditing: (state, action: PayloadAction<boolean>) => {
            state.isEditing = action.payload;
        },
        changeSectionPosition: (
            state,
            action: PayloadAction<{ oldIndex: number; newIndex: number }>
        ) => {
            const { oldIndex, newIndex } = action.payload;

            const updatedSections = [...state.landingPageSections]; // Copy array
            const [removed] = updatedSections.splice(oldIndex, 1); // Remove
            if (removed) {
                updatedSections.splice(newIndex, 0, removed); // Insert at new position
            }

            state.landingPageSections = updatedSections;
        },
        addDataToSection: (
            state,
            action: PayloadAction<{
                index: number;
                componentData: Section;
            }>
        ) => {
            const { index, componentData } = action.payload;
            if (state.landingPageSections[index]) {
                state.landingPageSections[index].componentData = componentData;
            }
        },
        removeSection: (state, action: PayloadAction<number>) => {
            state.landingPageSections.splice(action.payload, 1);
        },
    },
});

export const {
    clearLandingPage,
    setLandingPageSection,
    setLandingPageData,
    addNewSection,
    setEditing,
    changeSectionPosition,
    removeSection,
    addDataToSection,
} = landingPageSlice.actions;

export default landingPageSlice.reducer;
