import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const SubscriptionLoadingCard = () => {
    return (
        <Card className="relative flex flex-col overflow-hidden">
            <CardHeader className="space-y-4 pb-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-6 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    );
};
