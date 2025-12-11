"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Loader2 } from "lucide-react";

export const GenerateSkeleton = () => {
    return (
        <Card>
            <CardContent className="flex items-center justify-center py-6 lg:py-12">
                <div className="text-center">
                    <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
                    <h3 className="mb-2 text-lg font-semibold">AI is processing your order...</h3>
                    <p className="text-muted-foreground">Extracting customer and product information</p>
                </div>
            </CardContent>
        </Card>
    );
};
