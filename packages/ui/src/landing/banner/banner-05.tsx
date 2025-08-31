import { ComponentProps } from "@workspace/ui/landing/types.js";

export const Banner05 = ({ data }: ComponentProps) => {
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg bg-cover bg-center py-12"
      style={{ backgroundImage: `url(${data?.bgURL})` }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-primary/70"></div>
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {data?.subTitle && (
          <span className="mb-3 inline-block rounded-full bg-white px-4 py-1 text-sm font-medium text-primary">
            {data?.subTitle}
          </span>
        )}
        <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">
          {data?.title}
        </h1>
        <p className="mb-4 max-w-2xl text-lg text-white/90">
          {data?.description}
        </p>

        {data?.customizeDescription && (
          <div
            className="mb-6 text-xl text-white md:text-2xl"
            dangerouslySetInnerHTML={{
              __html: data?.customizeDescription,
            }}
          />
        )}

        <a
          href={data?.buttonUrl}
          className="inline-block rounded-md bg-white px-8 py-4 font-medium text-primary transition-colors hover:bg-gray-100"
        >
          {data?.buttonText}
        </a>
      </div>
    </div>
  );
};
