import { ComponentProps } from "@workspace/ui/landing/types.js";

export const Banner04 = ({ data, Image, Link }: ComponentProps) => {
  const ImageComponent = Image || "img";
  const LinkComponent = Link || "a";
  return (
    <div className="flex flex-col items-center justify-between gap-8 rounded-lg bg-white p-8 shadow-md md:flex-row">
      <div className="max-w-md">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">{data?.title}</h1>
        <p className="mb-6 text-lg text-gray-600">{data?.description}</p>
        <LinkComponent
          href={data?.buttonUrl || "#"}
          className="inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {data?.buttonText}
        </LinkComponent>
      </div>
      <div className="relative">
        <ImageComponent
          src={data?.imgURL || "/placeholder.svg"}
          alt="Banner image"
          width={230}
          height={300}
          className="rounded-md shadow-lg"
        />
      </div>
    </div>
  );
};
