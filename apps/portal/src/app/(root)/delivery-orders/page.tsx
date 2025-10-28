"use client";

import { useGetSteadfastRiderNoteQuery } from "@/redux/api/couriar-api";

const Page = () => {
    const { data, isLoading } = useGetSteadfastRiderNoteQuery({
        page: 1,
        limit: 10,
    });

    return (
        <div>
            <h1>Rider Note</h1>

            {isLoading && <div>Loading...</div>}

            {data && <div>{data.data.length}</div>}

            {data && (
                <div>
                    {data.data.map((item) => (
                        <div key={item.id}>{item.riderNote}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Page;
