import { PaginatedResponse } from "@/types";

import { LandingPage } from "@/types/landing-type";
import { CustomFetch } from "@/lib/CustomFetch";

const getLandingPages = async () => {
    const response = await CustomFetch<PaginatedResponse<LandingPage>>(`/landingPageLayout`);

    return response;
};

export { getLandingPages };
