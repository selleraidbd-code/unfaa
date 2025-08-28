import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Component } from "@repo/ui/type/index";

export interface ComponentState {
    components: Component[] | [];
}

const initialState: ComponentState = {
    components: [],
};

const componentsSlice = createSlice({
    name: "components",
    initialState,
    reducers: {
        setComponents: (state, action: PayloadAction<Component[]>) => {
            state.components = action.payload;
        },
    },
});

export const { setComponents } = componentsSlice.actions;

export default componentsSlice.reducer;
