import { Props } from "@repo/ui/type/index";

const Features01 = ({ data }: Props) => {
    return (
        <div className="min-h-screen flex bg-background items-center justify-center py-12">
            <div>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
                    {data?.title}
                </h2>
                <div className="mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-(--breakpoint-lg) mx-auto px-6">
                    {data?.sectionList.map((feature) => (
                        <div
                            key={feature.title}
                            className="flex flex-col border rounded-xl py-6 px-5"
                        >
                            {feature.icon && (
                                <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                            )}
                            <span className="text-lg font-semibold">
                                {feature.title}
                            </span>
                            <p className="mt-1 text-foreground/80 text-[15px]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { Features01 };
