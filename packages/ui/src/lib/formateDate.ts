export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

export const formatDateShortWithTime = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
