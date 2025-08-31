import { ComponentProps } from "@workspace/ui/landing/types.js";

export const Banner01 = ({ data, Image }: ComponentProps) => {
  const ImageComponent = Image || "img";
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{data?.title}</h1>
        <p className="text-lg">{data?.description}</p>
        <button className="text-red-300">{data?.buttonText}</button>
      </div>
      <div>
        <ImageComponent
          src={data?.imgURL as string}
          alt="banner img "
          width={230}
          height={300}
        />
      </div>
    </div>
  );
};
