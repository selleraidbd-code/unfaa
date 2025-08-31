import { Card } from "@workspace/ui/components/card";
import { CardContent } from "@workspace/ui/components/card";
import { Section } from "@workspace/ui/landing/types.js";

type Props = {
    data?: Section;
};

export const Testimonial01 = ({ data }: Props) => {
    return (
        <section
            id="testimonials"
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
                    <Card className="bg-white">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                                    <img
                                        src="http://multi-media-server.naimurrhman.com/uploads/img/1745062787925-672674933.jpg"
                                        alt="Client 1"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-2 text-center">
                                    <p className="text-gray-500">
                                        "Alex's ability to understand our users'
                                        needs and translate them into intuitive
                                        designs transformed our product. The
                                        redesign led to a significant increase
                                        in user engagement and satisfaction."
                                    </p>
                                    <div>
                                        <h4 className="font-semibold">
                                            Sarah Johnson
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Product Manager, TechCorp
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                                    <img
                                        src="http://multi-media-server.naimurrhman.com/uploads/img/1745062787925-672674933.jpg"
                                        alt="Client 2"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-2 text-center">
                                    <p className="text-gray-500">
                                        "Working with Alex was a game-changer
                                        for our startup. Their design thinking
                                        approach helped us identify and solve
                                        problems we didn't even know existed.
                                        Highly recommended!"
                                    </p>
                                    <div>
                                        <h4 className="font-semibold">
                                            Michael Chen
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Co-founder, InnovateLab
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                                    <img
                                        src="http://multi-media-server.naimurrhman.com/uploads/img/1745062787925-672674933.jpg"
                                        alt="Client 3"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-2 text-center">
                                    <p className="text-gray-500">
                                        "Alex has an exceptional eye for detail
                                        and a deep understanding of user
                                        psychology. Their designs are not just
                                        beautiful but also highly functional and
                                        user-friendly."
                                    </p>
                                    <div>
                                        <h4 className="font-semibold">
                                            Emily Rodriguez
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            UX Director, DesignHub
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};
