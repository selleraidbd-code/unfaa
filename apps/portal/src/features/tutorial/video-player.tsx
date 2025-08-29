"use client";

interface VideoPlayerProps {
    tutorial: {
        id: number;
        title: string;
        description: string;
        image: string;
        deviceType: "mobile" | "laptop" | "desktop";
        hasVideo: boolean;
        duration: string;
        views: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
}

export const VideoPlayer = ({
    tutorial,
    isOpen,
    onClose,
}: VideoPlayerProps) => {
    if (!isOpen || !tutorial) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Video Player Container */}
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-white/40 rounded-full flex items-center justify-center transition-colors z-20 text-black"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <div className="w-full h-full max-w-2xl max-h-[50vh] mx-auto p-4">
                    {/* Video Content */}
                    <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 rounded-lg overflow-hidden">
                        {/* YouTube-style Header */}
                        <div className="absolute top-0 left-0 right-0 p-4 z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <span className="text-purple-600 font-bold text-sm">
                                        #
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg leading-tight">
                                        {tutorial.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                                        <span>{tutorial.views} views</span>
                                        <span>•</span>
                                        <span>Unfaa</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Video Content */}
                        <div className="relative w-full h-full flex items-center justify-center p-20">
                            {/* Large Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-700 hover:scale-110 transition-all duration-300">
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth="0"
                                        viewBox="0 0 512 512"
                                        height="40"
                                        width="40"
                                        className="text-white ml-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M508.64 148.79c0-45-33.1-81.2-74-81.2C379.24 65 322.74 64 265 64h-18c-57.6 0-114.2 1-169.6 3.6C36.6 67.6 3.5 104 3.5 149 1 184.59-.06 220.19 0 255.79q-.15 53.4 3.4 106.9c0 45 33.1 81.5 73.9 81.5 58.2 2.7 117.9 3.9 178.6 3.8q91.2.3 178.6-3.8c40.9 0 74-36.5 74-81.5 2.4-35.7 3.5-71.3 3.4-107q.34-53.4-3.26-106.9zM207 353.89v-196.5l145 98.2z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
