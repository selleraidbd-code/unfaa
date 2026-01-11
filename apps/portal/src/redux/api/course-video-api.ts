import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/type";

import { CourseVideo, CreateCourseVideo, UpdateCourseVideo } from "@/types/course-type";

const courseVideoApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createCourseVideo: builder.mutation<void, CreateCourseVideo>({
            query: (payload) => ({
                url: `/course-videos`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.CourseVideo, TagType.Course],
        }),
        getCourseVideos: builder.query<PaginatedResponse<CourseVideo>, QueryParams & { courseId?: string }>({
            query: (queryParams) => ({
                url: `/course-videos`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.CourseVideo],
        }),
        getCourseVideo: builder.query<ResponseObject<CourseVideo>, { id: string }>({
            query: ({ id }) => ({
                url: `/course-videos/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.CourseVideo],
        }),
        updateCourseVideo: builder.mutation<void, { id: string; payload: UpdateCourseVideo }>({
            query: ({ id, payload }) => ({
                url: `/course-videos/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.CourseVideo, TagType.Course],
        }),
        deleteCourseVideo: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/course-videos/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.CourseVideo, TagType.Course],
        }),
    }),
});

export const {
    useGetCourseVideosQuery,
    useGetCourseVideoQuery,
    useCreateCourseVideoMutation,
    useUpdateCourseVideoMutation,
    useDeleteCourseVideoMutation,
} = courseVideoApi;
