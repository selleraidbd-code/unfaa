import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/type";

import { Course, CreateCourse, UpdateCourse } from "@/types/course-type";

const courseApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation<void, CreateCourse>({
            query: (payload) => ({
                url: `/courses`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Course],
        }),
        getCourses: builder.query<PaginatedResponse<Course>, QueryParams>({
            query: (queryParams) => ({
                url: `/courses`,
                method: METHOD.GET,
                params: queryParams,
            }),
            providesTags: [TagType.Course],
        }),
        getCourse: builder.query<ResponseObject<Course>, { id: string }>({
            query: ({ id }) => ({
                url: `/courses/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Course],
        }),
        updateCourse: builder.mutation<void, { id: string; payload: UpdateCourse }>({
            query: ({ id, payload }) => ({
                url: `/courses/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Course],
        }),
        deleteCourse: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/courses/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Course, TagType.CourseVideo],
        }),
    }),
});

export const {
    useGetCoursesQuery,
    useGetCourseQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
} = courseApi;
