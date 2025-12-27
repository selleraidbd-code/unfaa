interface WebCustomizationHeaderProps {
    title: string;
    description: string;
    button: React.ReactNode;
}

export const WebCustomizationHeader = ({ title, description, button }: WebCustomizationHeaderProps) => {
    return (
        <div className="flex w-full flex-wrap justify-between gap-2 sm:gap-3">
            <div>
                <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
                <p className="text-muted-foreground mt-1 max-w-[600px] text-xs font-normal text-wrap sm:text-sm xl:max-w-2xl">
                    {description}
                </p>
            </div>
            {button}
        </div>
    );
};
