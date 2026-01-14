"use client";

import { User } from "@/features/auth/auth-type";
import { useUpdateUserMutation } from "@/redux/api/auth-api";
import { UserRole } from "@/types";
import { AlertType } from "@workspace/ui/components/custom/custom-alert-dialogue";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { toast } from "@workspace/ui/components/sonner";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { Shield, Trash } from "lucide-react";

import { useAlert } from "@/hooks/useAlert";
import { CustomButton } from "@/components/ui/custom-button";

interface UserDetailsDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: (id: string) => void;
}

export const UserDetailsDialog = ({ user, open, onOpenChange, onDelete }: UserDetailsDialogProps) => {
    const { fire } = useAlert();
    const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserMutation();

    const handleMakeAdmin = () => {
        if (!user) return;

        fire({
            title: "Make User Admin",
            description: `Are you sure you want to make ${user.name} an admin? This action will grant them admin privileges.`,
            type: AlertType.ERROR,
            onConfirm: async () => {
                try {
                    await updateUserRole({
                        id: user.id,
                        role: UserRole.ADMIN,
                    }).unwrap();

                    toast.success("🎉 User role updated to admin successfully");
                    onOpenChange(false);
                } catch (error: any) {
                    toast.error(error.data?.message || "Something went wrong");
                }
            },
        });
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:!w-[80vw] lg:!w-[45vw] xl:!w-[40vw] 2xl:!w-[35vw]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">User Details</DialogTitle>
                    <DialogDescription>View and manage user information.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-muted-foreground text-sm font-medium">ID</label>
                            <p className="text-sm font-medium">{user.id}</p>
                        </div>
                        <div>
                            <label className="text-muted-foreground text-sm font-medium">Name</label>
                            <p className="text-sm font-medium">{user.name}</p>
                        </div>
                        <div>
                            <label className="text-muted-foreground text-sm font-medium">Email</label>
                            <p className="text-sm font-medium">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-muted-foreground text-sm font-medium">Role</label>
                            <p className="text-sm font-medium">{user.role}</p>
                        </div>
                        <div>
                            <label className="text-muted-foreground text-sm font-medium">Created At</label>
                            <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
                        </div>
                        <div>
                            <label className="text-muted-foreground text-sm font-medium">Verified</label>
                            <p className="text-sm font-medium">{user.isVerified ? "Yes" : "No"}</p>
                        </div>
                        <div>
                            <label className="text-muted-foreground text-sm font-medium">Blocked</label>
                            <p className="text-sm font-medium">{user.isBlocked ? "Yes" : "No"}</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 border-t pt-4">
                        <CustomButton
                            onClick={() => onDelete(user.id)}
                            variant="destructive"
                            icon={<Trash className="h-4 w-4" />}
                        >
                            Delete
                        </CustomButton>
                        {user.role === UserRole.USER && (
                            <CustomButton
                                onClick={handleMakeAdmin}
                                isLoading={isUpdatingRole}
                                variant="default"
                                icon={<Shield className="h-4 w-4" />}
                            >
                                Make Admin
                            </CustomButton>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
