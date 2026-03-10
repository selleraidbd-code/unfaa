"use client";

import { FC, useEffect } from "react";

import { Button } from "@workspace/ui/components/button";

import { Logo } from "@/components/shared/logo";

type ErrorProps = { error: Error; reset: () => void };
const Error: FC<ErrorProps> = ({ error, reset }) => {
    // Log the error to an error reporting service
    useEffect(() => console.error("Application error:", error), [error]);

    const handleReset = () => {
        reset();
        window.location.reload();
    };

    return (
        <div className="bg-background text-foreground fixed inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <main className="relative z-10 flex h-[calc(100vh-4px)] w-full items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center sm:gap-6">
                    <Logo />
                    <h1 className="from-primary bg-gradient-to-r to-violet-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                        Oops! Something went wrong
                    </h1>

                    <p className="text-muted-foreground max-w-md text-base sm:text-lg">
                        We apologize for the inconvenience. Please try again or contact our support team
                        <a
                            href="mailto:unfaa9@gmail.com"
                            className="hover:text-gradient text-primary px-1 hover:underline"
                        >
                            unfaa9@gmail.com
                        </a>
                        if the problem persists.
                    </p>

                    <div className="mt-2 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:gap-4">
                        <Button size="lg" onClick={handleReset} className="min-w-[160px] sm:min-w-[200px]">
                            Try again
                        </Button>

                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => (window.location.href = "/")}
                            className="min-w-[160px] sm:min-w-[200px]"
                        >
                            Go to homepage
                        </Button>
                    </div>

                    {process.env.NODE_ENV === "development" && (
                        <div className="container mt-4 max-h-[30vh] overflow-x-auto overflow-y-auto rounded-md border p-3 text-left backdrop-blur-sm sm:mt-6 sm:p-4">
                            <p className="text-muted-foreground text-sm font-medium">Error details:</p>
                            <pre className="mt-2 text-sm text-wrap">{error.message}</pre>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Error;
