import { config } from "@/config";

type GetLinkProps = {
    shopSlug: string;
    path: string;
    includeDomain?: boolean;
};

export const getLink = ({ shopSlug, path, includeDomain = false }: GetLinkProps) => {
    const link = includeDomain ? `${config.webUrl}/${shopSlug}${path}` : `/${shopSlug}${path}`;

    return link;
};
