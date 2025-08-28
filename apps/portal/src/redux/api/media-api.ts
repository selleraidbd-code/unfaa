import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, TagType } from "@/redux/type";
import { QueryParams, ResponseObject } from "@/redux/type";
import { Media } from "@/types/media-type";

const mediaApi = api.injectEndpoints({
    endpoints: (builder) => ({
        uploadImage: builder.mutation<ResponseObject<Media>, FormData>({
            query: (formData) => ({
                url: `/file-upload/upload-image`,
                method: METHOD.POST,
                body: formData,
            }),
            invalidatesTags: [TagType.Media],
        }),
        getImages: builder.query<PaginatedResponse<Media[]>, QueryParams>({
            query: (params) => ({
                url: `/uploadedImage`,
                method: METHOD.GET,
                params,
            }),
            providesTags: [TagType.Media],
        }),
    }),
});

export const { useUploadImageMutation, useGetImagesQuery } = mediaApi;
