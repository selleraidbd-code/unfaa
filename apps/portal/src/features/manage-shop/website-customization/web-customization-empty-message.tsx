interface WebCustomizationEmptyMessageProps {
    title: string;
    description: string;
}

export const WebCustomizationEmptyMessage = ({
    title,
    description,
}: WebCustomizationEmptyMessageProps) => {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 py-16 px-6">
            <h3 className="font-medium ">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                {description}
            </p>
        </div>
    );
};
