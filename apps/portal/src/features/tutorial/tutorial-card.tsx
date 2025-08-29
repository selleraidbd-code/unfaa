import { Tutorial } from "@/types/tutorial-type";
import { Button } from "@workspace/ui/components/button";
import { Trash2, Youtube } from "lucide-react";
import Image from "next/image";
import { UpdateTutorialDialog } from "./update-tutorial-dialog";

export const TutorialCard = ({
    tutorial,
    openModal,
    handleDelete,
    isPermission,
}: {
    tutorial: Tutorial;
    openModal: (tutorial: Tutorial) => void;
    handleDelete: (id: string) => void;
    isPermission?: boolean;
}) => {
    return (
        <div key={tutorial.id} className="bg-white shadow-sm rounded-lg">
            <div
                className="group relative overflow-hidden rounded-t-lg hover:shadow-purple-500/40 transition-all duration-300 cursor-pointer"
                onClick={() => openModal(tutorial)}
            >
                <div className="relative h-64 overflow-hidden">
                    <Image
                        src={tutorial.imgURL || "/placeholder.svg"}
                        alt={tutorial.title || "Tutorial"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /> */}

                    {/* Play Button Overlay */}
                    {tutorial.videoLink && (
                        <div className="absolute inset-0 flex items-center justify-center ">
                            <div
                                className="pulse-wave w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center
                          shadow-md hover:scale-120 transition-transform duration-300
                        cursor-pointer group"
                            >
                                <Youtube className="text-white w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Title & Description */}
            <div className="p-4 flex items-center">
                <p className="text-sm line-clamp-2 pr-2">
                    <div className="w-8 h-8 italic rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        U
                    </div>
                </p>
                <p>
                    <span className="font-semibold">Unfaa </span>
                    {tutorial.title}
                </p>
            </div>

            {/* 🔐 Permission-based Buttons */}
            {isPermission && (
                <div className="flex justify-end items-center border-t p-4 gap-4">
                    <UpdateTutorialDialog tutorial={tutorial} />

                    <Button
                        variant="destructive"
                        onClick={() => handleDelete(tutorial.id)}
                    >
                        <Trash2 size={16} className="text-white" /> Delete
                    </Button>
                </div>
            )}
        </div>
    );
};
