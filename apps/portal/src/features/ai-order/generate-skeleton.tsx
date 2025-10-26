"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Loader2 } from "lucide-react";

export const GenerateSkeleton = () => {
    return (
        <Card>
            <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2">
                        AI is processing your order...
                    </h3>
                    <p className="text-muted-foreground">
                        Extracting customer and product information
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
