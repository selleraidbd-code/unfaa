import { ComponentProps } from "@workspace/ui/landing/types.js";

export const Features05 = ({ data }: ComponentProps) => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          {data?.subTitle && (
            <p className="mb-2 font-medium text-primary">{data?.subTitle}</p>
          )}
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{data?.title}</h2>
          <p className="mx-auto max-w-2xl text-gray-600">{data?.description}</p>
        </div>

        <div className="space-y-24">
          {data?.sectionList.map((feature, index) => (
            <div
              key={feature.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-8 lg:gap-16`}
            >
              <div className="w-full lg:w-1/2">
                {feature.imgURL && (
                  <img
                    src={feature.imgURL || "/placeholder.jpg"}
                    alt={feature.title || "Feature illustration"}
                    className="h-auto w-full rounded-lg shadow-md"
                  />
                )}
              </div>
              <div className="w-full lg:w-1/2">
                <h3 className="mb-4 text-2xl font-bold">{feature.title}</h3>
                <p className="mb-6 text-lg leading-relaxed text-gray-600">
                  {feature.description}
                </p>
                {feature.buttonText && feature.buttonUrl && (
                  <a
                    href={feature.buttonUrl}
                    className="inline-flex items-center font-medium text-primary"
                  >
                    {feature.buttonText}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
