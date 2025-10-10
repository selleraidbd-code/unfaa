import { getLink } from "@/lib/get-link";
import { ShopThemeCategory } from "@/types/shop-type";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";

export const NavCategories = ({
    categories,
    shopSlug,
}: {
    categories: ShopThemeCategory[];
    shopSlug: string;
}) => {
    const categoryItems = categories.map((category) => ({
        label: category.category.name,
        href: getLink({
            shopSlug,
            path: `/category/${category.category.id}`,
        }),
    }));

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-primary h-10 w-48 text-primary-foreground hover:!bg-primary hover:!text-primary-foreground focus:!bg-primary focus:!text-primary-foreground data-[state=open]:!bg-primary data-[state=open]:!text-primary-foreground">
                        Browse Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="grid w-44 gap-1">
                            {categoryItems.map((item) => (
                                <NavigationMenuLink
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-primary focus:bg-accent focus:text-primary"
                                    key={item.label}
                                    href={item.href}
                                >
                                    {item.label}
                                </NavigationMenuLink>
                            ))}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};
