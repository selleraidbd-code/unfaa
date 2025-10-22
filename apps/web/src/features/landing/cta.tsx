import { Button } from "@workspace/ui/components/button";
import { ArrowRight, Check } from "lucide-react";

export const CTA = () => {
    return (
        <section className="py-20 sm:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white mb-6">
                    Ready to Transform Your E-Commerce Business?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    Join thousands of businesses already saving time and growing
                    faster with our automation platform. Start your free 5-day
                    trial today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100"
                    >
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-white border-white hover:bg-white/10"
                    >
                        Contact Sales
                    </Button>
                </div>
                <div className="flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
                    <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        No credit card required
                    </span>
                    <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        5-day free trial
                    </span>
                    <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Cancel anytime
                    </span>
                </div>
            </div>
        </section>
    );
};
