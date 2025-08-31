import { data } from "@workspace/ui/landing/data.js";

import type { Section } from "./types.js";

export const allComponents = data.flatMap((category) =>
    category.components.map((item) => ({
        name: item.name,
        component: item.component,
        category: category.category,
        description: item.description,
        fieldLabel: "fieldLabel" in item ? item.fieldLabel : undefined,
        defaultValue: item.defaultValue as unknown as Section,
    }))
);
