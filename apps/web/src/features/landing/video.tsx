export const Video = () => {
    return (
        <section id="video" className="py-20 sm:py-24 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        See Unfaa in Action
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Watch how Unfaa transforms your e-commerce operations
                        and streamlines your order management process
                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div
                        className="relative w-full"
                        style={{ paddingBottom: "56.25%" }}
                    >
                        <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl"
                            src="https://www.youtube.com/embed/39UUM2PBURw?start=1"
                            title="Unfaa Demo Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
