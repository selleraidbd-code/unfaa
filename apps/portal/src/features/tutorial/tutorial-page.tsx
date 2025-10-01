"use client";

import { TutorialCard } from "@/features/tutorial/tutorial-card";
import { TutorialCardSkeleton } from "@/features/tutorial/tutorial-card-skeleton";
import { useAlert } from "@/hooks/useAlert";
import {
    useDeleteTutorialMutation,
    useGetTutorialsQuery,
} from "@/redux/api/tutorial-api";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "@workspace/ui/components/sonner";

interface Tutorial {
    id: string;
    title?: string;
    description?: string;
    imgURL: string;
    videoLink: string;
}

interface TutorialPageProps {
    isPermission?: boolean;
}

const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2] && match[2].length === 11 ? match[2] : null;
};

const TutorialPage = ({ isPermission }: TutorialPageProps) => {
    const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { fire } = useAlert();

    const { data, isLoading } = useGetTutorialsQuery({});
    const tutorials = data?.data || [];

    const openModal = (tutorial: Tutorial) => {
        setSelectedTutorial(tutorial);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTutorial(null);
    };

    const [deleteTutorial] = useDeleteTutorialMutation();

    const handleDelete = (id: string) => {
        fire({
            title: "Delete Tutorial",
            description: "Are you sure you want to delete this tutorial?",
            onConfirm: async () => {
                await deleteTutorial({ id })
                    .unwrap()
                    .then(() => {
                        toast.success("Tutorial deleted successfully");
                    })
                    .catch((error) => {
                        toast.error(error.data.message);
                    });
            },
        });
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <TutorialCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((tutorial) => (
                    <TutorialCard
                        key={tutorial.id}
                        tutorial={tutorial}
                        openModal={openModal}
                        handleDelete={handleDelete}
                        isPermission={isPermission}
                    />
                ))}
            </div>

            {/* Video Modal */}
            {isModalOpen && selectedTutorial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="relative w-full max-w-6xl">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute -top-2 -right-2 cursor-pointer z-10 bg-white hover:bg-gray-200 p-2 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* YouTube Video */}
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-3xl">
                            {selectedTutorial.videoLink &&
                            getYouTubeVideoId(selectedTutorial.videoLink) ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                                        selectedTutorial.videoLink
                                    )}?autoplay=1&rel=0&modestbranding=1`}
                                    title={
                                        selectedTutorial.title ||
                                        "Tutorial Video"
                                    }
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-white">
                                    <p>Invalid video link</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TutorialPage;
