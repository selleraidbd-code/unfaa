import Image from "next/image";

import type { Section } from "@repo/ui/type/index";

type Props = {
    data?: Section;
};

export const Features03 = ({ data }: Props) => {
    return (
        <section className="bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    {data?.subTitle && (
                        <p className="mb-2 font-medium text-primary">
                            {data?.subTitle}
                        </p>
                    )}
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        {data?.title}
                    </h2>
                    <p className="mx-auto max-w-2xl text-gray-600">
                        {data?.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {data?.sectionList.map((feature) => (
                        <div
                            key={feature.id}
                            className="rounded-lg bg-card p-6 shadow-2xs transition-shadow hover:shadow-md"
                        >
                            {feature.imgURL && (
                                <div className="mb-4">
                                    <Image
                                        src={
                                            feature.imgURL || "/placeholder.jpg"
                                        }
                                        alt={feature.title || "Feature icon"}
                                        width={80}
                                        height={80}
                                        className="mx-auto"
                                    />
                                </div>
                            )}
                            <h3 className="mb-2 text-center text-xl font-semibold">
                                {feature.title}
                            </h3>
                            <p className="text-center text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
