// Utility function to deeply compare objects and arrays
const deepEqual = (obj1: unknown, obj2: unknown): boolean => {
    if (obj1 === obj2) return true;

    if (obj1 == null || obj2 == null) return obj1 === obj2;

    if (typeof obj1 !== typeof obj2) return false;

    if (typeof obj1 !== "object") return obj1 === obj2;

    if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

    if (Array.isArray(obj1)) {
        if (obj1.length !== (obj2 as unknown[]).length) return false;
        return obj1.every((item, index) =>
            deepEqual(item, (obj2 as unknown[])[index])
        );
    }

    const keys1 = Object.keys(obj1 as Record<string, unknown>);
    const keys2 = Object.keys(obj2 as Record<string, unknown>);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(
        (key) =>
            keys2.includes(key) &&
            deepEqual(
                (obj1 as Record<string, unknown>)[key],
                (obj2 as Record<string, unknown>)[key]
            )
    );
};

// Function to get only changed fields
export const getChangedFields = (
    original: Record<string, unknown>,
    current: Record<string, unknown>
): Record<string, unknown> => {
    const changes: Record<string, unknown> = {};

    for (const key in current) {
        if (Object.prototype.hasOwnProperty.call(current, key)) {
            if (!deepEqual(original[key], current[key])) {
                changes[key] = current[key];
            }
        }
    }

    return changes;
};
