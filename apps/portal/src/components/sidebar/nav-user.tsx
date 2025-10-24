import {
    Bell,
    ChevronDown,
    CreditCard,
    LogOut,
    UserCircle,
} from "lucide-react";

import { User } from "@/features/auth/auth-type";
import { logoutThunk } from "@/redux/slices/auth-slice";
import {} from "@/redux/store";
import { useAppDispatch } from "@/redux/store/hook";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@workspace/ui/components/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@workspace/ui/components/sidebar";

export function NavUser({ user }: { user: User | null }) {
    const dispatch = useAppDispatch();

    const handleSignOut = async () => {
        dispatch(logoutThunk());
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent group data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <UserInfo user={user} imageOnly />

                            <ChevronDown className="h-4 w-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="mt-1 min-w-56 rounded-lg"
                        align="end"
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <UserInfo user={user} />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <UserCircle />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

const UserInfo = ({
    user,
    imageOnly,
}: {
    user: User | null;
    imageOnly?: boolean;
}) => {
    return (
        <>
            <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user?.photoUrl} alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                    {user?.name?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            {!imageOnly && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                        {user?.email}
                    </span>
                </div>
            )}
        </>
    );
};
