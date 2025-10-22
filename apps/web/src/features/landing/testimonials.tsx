import { Card, CardContent } from "@workspace/ui/components/card";
import { Star } from "lucide-react";

export const Testimonials = () => {
    const testimonials = [
        {
            name: "Imran Kazi",
            role: "E-commerce Store Owner",
            content:
                "Before using this tool, I used to accidentally send one customer's parcel to another. After using this system, there are no mistakes in preparing parcels. Now I send parcels accurately, no errors, and it takes less time.",
            rating: 5,
        },
        {
            name: "Sohel Rana",
            role: "Online Seller",
            content:
                "Previously, it took me about 1 minute to enter an order. Here I just paste the message, write what product they want and the price, and it's done. The work that took 2 hours before, now takes 15 minutes. Everyone should try it.",
            rating: 5,
        },
        {
            name: "Fatima Ahmed",
            role: "Fashion Boutique Owner",
            content:
                "This automation system has been a game-changer for my business. Managing inventory and orders is now effortless. The fraud detection feature alone has saved me thousands of taka.",
            rating: 5,
        },
    ];

    return (
        <section
            id="about"
            className="py-20 sm:py-24 bg-gradient-to-b from-white to-gray-50"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Loved by E-Commerce Businesses
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        See what our customers say about transforming their
                        operations
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="hover:shadow-xl transition-shadow duration-300"
                        >
                            <CardContent className="p-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <Star
                                                key={i}
                                                className="h-5 w-5 fill-yellow-400 text-yellow-400"
                                            />
                                        )
                                    )}
                                </div>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {testimonial.content}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {testimonial.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
