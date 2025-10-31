"use client";

import { useGetSteadfastRiderNoteQuery } from "@/redux/api/couriar-api";

export const RiderNote = () => {
    const { data: riderNoteData, isLoading: isRiderNoteLoading } =
        useGetSteadfastRiderNoteQuery({
            page: 1,
            limit: 10,
        });

    console.log(riderNoteData);

    return (
        <div>
            <h1>Rider Note</h1>
        </div>
    );
};
