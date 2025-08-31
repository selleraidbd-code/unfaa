import Image from "next/image";

import type { Section } from "@repo/ui/type/index";

type Props = {
    data?: Section;
};

export const Banner02 = ({ data }: Props) => {
    return (
        <div className="flex flex-col items-center rounded-lg bg-gray-50 p-8 text-center">
            <div className="mb-8 max-w-2xl">
                {data?.subTitle && (
                    <span className="mb-2 inline-block text-sm font-medium text-primary">
                        {data?.subTitle}
                    </span>
                )}
                <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                    {data?.title}
                </h1>
                <p className="mb-6 text-lg text-gray-600">
                    {data?.description}
                </p>
                <a
                    href={data?.buttonUrl}
                    className="inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    {data?.buttonText}
                </a>
            </div>
            <div className="w-full max-w-3xl">
                <Image
                    src={data?.imgURL || "/placeholder.svg"}
                    alt="Banner image"
                    width={600}
                    height={400}
                    className="h-auto w-full rounded-lg shadow-md"
                />
            </div>
        </div>
    );
};
