import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { cn } from "@workspace/ui/lib/utils";

type TCustomCollapsible = {
    title: string;
    content: React.ReactNode;
    className?: string;
    collapsible?: boolean;
};

export const CustomCollapsible = ({
    title,
    content,
    className,
    collapsible = true,
}: TCustomCollapsible) => {
    return (
        <Accordion
            type="single"
            collapsible={collapsible}
            className={cn("w-full rounded-lg px-6 border", className)}
            defaultValue={title}
        >
            <AccordionItem value={title}>
                <AccordionTrigger
                    collapsible={collapsible}
                    className={cn(
                        "hover:no-underline text-base md:text-lg lg:text-xl font-medium",
                        collapsible ? "cursor-pointer" : "cursor-default"
                    )}
                >
                    {title}
                </AccordionTrigger>
                <AccordionContent>{content}</AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
