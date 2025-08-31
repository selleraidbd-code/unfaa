import { ComponentProps } from "@workspace/ui/landing/types.js";

export const Banner06 = ({ data, Image, Link }: ComponentProps) => {
  const LinkComponent = Link || "a";
  const ImageComponent = Image || "img";
  return (
    <div className="grid grid-cols-1 gap-8 rounded-lg bg-white p-8 shadow-md md:grid-cols-2">
      <div className="relative h-full min-h-[300px]">
        <ImageComponent
          src={data?.imgURL || "/placeholder.svg"}
          alt="Banner image"
          width={230}
          height={300}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">{data?.title}</h1>
        <p className="mb-6 text-lg text-gray-600">{data?.description}</p>

        {data?.sectionList && data?.sectionList.length > 0 && (
          <div className="mb-6 space-y-4">
            {data?.sectionList.map((item) => (
              <div key={item.id} className="flex items-start">
                <div className="mr-3 mt-1 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <LinkComponent
          href={data?.buttonUrl || "#"}
          className="inline-block self-start rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {data?.buttonText}
        </LinkComponent>
      </div>
    </div>
  );
};
