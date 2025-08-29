import { NavUser } from "@/components/sidebar/nav-user";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import useGetUser from "@/hooks/useGetUser";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Globe } from "lucide-react";

export const SidebarNavbar = () => {
    const user = useGetUser();

    return (
        <header className="flex h-14 sticky top-0 z-10 bg-sidebar shrink-0 border-b items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />

                <Button>
                    <Globe className="size-4" /> Go to Website
                </Button>
            </div>

            <div className="ml-auto pr-8 flex items-center gap-4">
                <ThemeSwitcher />
                <NavUser user={user} />
            </div>
        </header>
    );
};
