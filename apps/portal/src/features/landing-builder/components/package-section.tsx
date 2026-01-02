"use client";

import { useState } from "react";
import Image from "next/image";

import { CreatePackageDialog } from "@/features/landing-builder/components/create-package-dialog";
import { EditPackageDialog } from "@/features/landing-builder/components/edit-package-dialog";
import { AlertType } from "@/providers/AlertProvider";
import { useDeletePackageMutation, useGetPackagesByProductIdQuery, useGetPackagesQuery } from "@/redux/api/package-api";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { Package as PackageIcon, Pencil, Plus, Trash2 } from "lucide-react";

import { Package } from "@/types/package-type";
import { useAlert } from "@/hooks/useAlert";

type PackageSectionProps = {
    shopId: string;
    productId: string;
};

export const PackageSection = ({ shopId, productId }: PackageSectionProps) => {
    const { fire } = useAlert();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);

    const { data: packagesData } = useGetPackagesByProductIdQuery({
        productId,
        queryParams: {
            shopId: shopId || "",
            limit: 50,
        },
    });

    const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation();

    const packages = packagesData?.data || [];

    const handleEditPackage = (pkg: Package) => {
        setEditingPackage(pkg);
        setIsEditDialogOpen(true);
    };

    const handleDeletePackage = (pkg: Package) => {
        fire({
            title: "Delete Package",
            description: `Are you sure you want to delete "${pkg.title}"? This action cannot be undone.`,
            type: AlertType.ERROR,
            onConfirm: async () => {
                await deletePackage({ id: pkg.id })
                    .unwrap()
                    .then(() => {
                        toast.success("Package deleted successfully");
                    })
                    .catch((err) => {
                        toast.error(err?.data?.message || "Failed to delete package");
                    });
            },
        });
    };

    return (
        <div className="bg-card space-y-6 rounded-lg border p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="mb-2 text-lg font-semibold">Packages</h2>
                    <p className="text-muted-foreground text-sm">Create and manage product packages for your shop</p>
                </div>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Package
                </Button>
            </div>

            {packages.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                    <div className="bg-muted mb-4 rounded-full p-4">
                        <PackageIcon className="text-muted-foreground h-8 w-8" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No packages yet</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                        Create your first package to bundle products together
                    </p>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Package
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="group relative rounded-lg border p-4">
                            <div className="bg-muted relative mb-3 aspect-video w-full overflow-hidden rounded-md">
                                <Image
                                    src={pkg.img || "/placeholder.jpg"}
                                    alt={pkg.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="mb-1 font-semibold">{pkg.title}</h3>
                            <div className="text-muted-foreground space-y-1 text-sm">
                                <p>COD Amount: {pkg.codAmount}</p>
                                <p>Save Amount: {pkg.saveAmount}</p>
                                <p>Products: {pkg.packageProducts.length}</p>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditPackage(pkg)}
                                    className="flex-1"
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeletePackage(pkg)}
                                    disabled={isDeleting}
                                    className="flex-1"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Package Dialog */}
            <CreatePackageDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                shopId={shopId}
                productId={productId}
            />

            {/* Edit Package Dialog */}
            <EditPackageDialog
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) {
                        setEditingPackage(null);
                    }
                }}
                package={editingPackage}
            />
        </div>
    );
};
