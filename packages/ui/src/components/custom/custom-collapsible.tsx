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
};

export const CustomCollapsible = ({
  title,
  content,
  className,
}: TCustomCollapsible) => {
  return (
    <Accordion
      type="single"
      collapsible
      className={cn("w-full rounded-lg px-6 border", className)}
      defaultValue={title}
    >
      <AccordionItem value={title}>
        <AccordionTrigger className="cursor-pointer hover:no-underline text-base md:text-lg lg:text-xl font-medium">
          {title}
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
