import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@workspace/ui/components/accordion";

export const FAQ = () => {
    const faqs = [
        {
            question: "How do I create an account?",
            answer: "Creating an account is very simple. Click on Sign Up, go to the sign-up page and fill in all the information. The admin will activate your account as soon as they see it. If you need to activate it quickly, you can message on WhatsApp at 01625269817.",
        },
        {
            question: "Is this free or paid?",
            answer: "This is a paid order management system tool. However, you get a 5-day free trial. Use it for 5 days and if you like it, subscribe. If you don't like it, you don't have to subscribe.",
        },
        {
            question: "Which courier services are integrated?",
            answer: "Currently, we integrate with Steadfast and Pathao courier services. We are working on adding more courier partners to give you more options.",
        },
        {
            question: "How does the automation work?",
            answer: "Simply copy your customer's message containing their details and paste it into our system. Our AI will automatically extract the name, phone number, address, and product details, then create an order in your courier system instantly.",
        },
        {
            question: "Can I upgrade or downgrade my plan?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, and we'll prorate any differences.",
        },
        {
            question: "What kind of support do you offer?",
            answer: "We offer email support for all plans, priority support for Standard plans, and 24/7 priority support for Premium plans. We're committed to helping you succeed.",
        },
    ];

    return (
        <section className="py-20 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600">
                        Everything you need to know about our platform
                    </p>
                </div>
                <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index + 1}`}
                            className="bg-white rounded-lg px-6 border"
                        >
                            <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};
