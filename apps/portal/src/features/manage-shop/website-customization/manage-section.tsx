import { WebCustomizationHeader } from "@/features/manage-shop/website-customization/web-customization-header";
import { ShopSection } from "@/types/shop-type";
import { Button } from "@workspace/ui/components/button";

export const ManageSection = ({ section }: { section: ShopSection }) => {
    return (
        <div className="w-full flex flex-col border-2 border-dashed border-slate-300 rounded-lg p-6">
            <WebCustomizationHeader
                title={section.title}
                description="Select at least 6 products (more is better) for better visual impact."
                button={
                    <div>
                        <Button>Divide</Button>
                    </div>
                }
            />
            <div className="mt-6">
                <h1>{section.title}</h1>
            </div>
        </div>
    );
};
