import { CategoryFormValues } from "@/features/category/create-category-dialog";
import { api } from "@/redux/api";
import { METHOD, ResponseObject, TagType } from "@/redux/type";
import { PaginatedResponse, QueryParams } from "@/redux/type";

import { Category, CreateCategory } from "@/types/category-type";

const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<void, CreateCategory>({
      query: (payload) => ({
        url: `/category/`,
        method: METHOD.POST,
        body: payload,
      }),
      invalidatesTags: [TagType.Category],
    }),
    getCategories: builder.query<PaginatedResponse<Category>, QueryParams>({
      query: (queryParams) => ({
        url: `/category/`,
        method: METHOD.GET,
        params: queryParams,
      }),
      providesTags: [TagType.Category],
    }),
    getCategory: builder.query<ResponseObject<Category>, { id: string }>({
      query: ({ id }) => ({
        url: `/category/${id}`,
        method: METHOD.GET,
      }),
      providesTags: [TagType.Category],
    }),
    updateCategory: builder.mutation<
      void,
      { id: string; payload: CategoryFormValues }
    >({
      query: ({ id, payload }) => ({
        url: `/category/${id}`,
        method: METHOD.PATCH,
        body: payload,
      }),
      invalidatesTags: [TagType.Category],
    }),
    deleteCategory: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/category/${id}`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: [TagType.Category],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
