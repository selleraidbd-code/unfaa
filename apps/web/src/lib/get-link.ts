import { config } from "@/config";

type GetLinkProps = {
    shopSlug: string;
    path: string;
    includeDomain?: boolean;
};

export const getLink = ({
    shopSlug,
    path,
    includeDomain = false,
}: GetLinkProps) => {
    const link = includeDomain
        ? `${config.webUrl}/shop/${shopSlug}${path}`
        : `/shop/${shopSlug}${path}`;

    return link;
};
