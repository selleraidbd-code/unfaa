import { PaginatedResponse } from "@/types";

import { LandingPage } from "@/types/landing-type";
import { CustomFetch } from "@/lib/CustomFetch";

const getLandingPages = async () => {
    const response = await CustomFetch<PaginatedResponse<LandingPage>>(`/landingPageLayout`);

    console.log("landing pages response", response);
    return response;
};

export { getLandingPages };
