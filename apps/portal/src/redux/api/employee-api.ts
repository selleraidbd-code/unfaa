import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, TagType } from "@/redux/type";

import {
  CreateEmployee,
  Employee,
  UpdateEmployee,
} from "@/types/employee-type";

const employeeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createEmployee: builder.mutation<void, CreateEmployee>({
      query: (payload) => ({
        url: `/shop-employee`,
        method: METHOD.POST,
        body: payload,
      }),
      invalidatesTags: [TagType.Category],
    }),
    getEmployees: builder.query<PaginatedResponse<Employee>, QueryParams>({
      query: (queryParams) => ({
        url: `/shop-employee/`,
        method: METHOD.GET,
        params: queryParams,
      }),
      providesTags: [TagType.Category],
    }),
    getEmployee: builder.query<Employee, { id: number }>({
      query: ({ id }) => ({
        url: `/shop-employee/${id}`,
        method: METHOD.GET,
      }),
      providesTags: [TagType.Category],
    }),
    updateEmployee: builder.mutation<void, UpdateEmployee>({
      query: ({ id, payload }) => ({
        url: `/shop-employee/${id}`,
        method: METHOD.PATCH,
        body: payload,
      }),
      invalidatesTags: [TagType.Category],
    }),
    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({
        url: `/shop-employee/${id}`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: [TagType.Category],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
