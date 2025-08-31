import { Section } from "@repo/ui/type/index";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Users } from "lucide-react";

type Props = {
    data?: Section;
};

export const Features06 = ({ data }: Props) => {
    return (
        <section
            id="services"
            className="w-full py-12 md:py-24 lg:py-32 bg-gray-50"
        >
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl text-primary font-bold tracking-tighter sm:text-5xl">
                            {data?.title}
                        </h2>
                        <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            {data?.subTitle}
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                    {data?.sectionList?.map((feature) => (
                        <Card key={feature.id} className="bg-white">
                            <CardContent className="flex flex-col items-center space-y-4 p-6">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">
                                    {feature.title}
                                </h3>
                                <p className="text-center text-gray-500">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
