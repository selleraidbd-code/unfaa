import { ComponentProps } from "@workspace/ui/landing/types.js";

const Features02 = ({ data, Image }: ComponentProps) => {
  const ImageComponent = Image || "img";
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <div className="w-full">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
          {data?.title}
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-md sm:max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) w-full mx-auto px-6">
          {data?.sectionList.map((feature) => (
            <div key={feature.title} className="flex flex-col text-start">
              <ImageComponent
                src={feature.imgURL || "/placeholder.jpg"}
                alt={feature.title || ""}
                className="mb-5 sm:mb-6 w-full aspect-4/5 bg-muted rounded-xl"
                width={400}
                height={400}
              />
              <span className="text-2xl font-semibold tracking-tight">
                {feature.title}
              </span>
              <p className="mt-2 max-w-[25ch] text-muted-foreground text-[17px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Features02 };
