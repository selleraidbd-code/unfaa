interface WebCustomizationHeaderProps {
    title: string;
    description: string;
    button: React.ReactNode;
}

export const WebCustomizationHeader = ({
    title,
    description,
    button,
}: WebCustomizationHeaderProps) => {
    return (
        <div className="flex justify-between w-full flex-wrap">
            <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm font-normal text-muted-foreground mt-1 max-w-[600px] text-wrap">
                    {description}
                </p>
            </div>
            {button}
        </div>
    );
};
