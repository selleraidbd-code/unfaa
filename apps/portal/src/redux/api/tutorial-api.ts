import { api } from "@/redux/api";
import {
  METHOD,
  PaginatedResponse,
  QueryParams,
  ResponseObject,
  TagType,
} from "@/redux/type";

import { CreateTutorial, Tutorial } from "@/types/tutorial-type";

const tutorialApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTutorial: builder.mutation<void, CreateTutorial>({
      query: (payload) => ({
        url: `/tutorial`,
        method: METHOD.POST,
        body: payload,
      }),
      invalidatesTags: [TagType.Tutorial],
    }),
    getTutorials: builder.query<PaginatedResponse<Tutorial>, QueryParams>({
      query: (queryParams) => ({
        url: `/tutorial`,
        method: METHOD.GET,
        params: queryParams,
      }),
      providesTags: [TagType.Tutorial],
    }),
    getTutorial: builder.query<ResponseObject<Tutorial>, { id: string }>({
      query: ({ id }) => ({
        url: `/tutorial/${id}`,
        method: METHOD.GET,
      }),
      providesTags: [TagType.Tutorial],
    }),
    updateTutorial: builder.mutation<
      void,
      { id: string; payload: CreateTutorial }
    >({
      query: ({ id, payload }) => ({
        url: `/tutorial/${id}`,
        method: METHOD.PATCH,
        body: payload,
      }),
      invalidatesTags: [TagType.Tutorial],
    }),
    deleteTutorial: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/tutorial/${id}`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: [TagType.Tutorial],
    }),
  }),
});

export const {
  useGetTutorialsQuery,
  useGetTutorialQuery,
  useCreateTutorialMutation,
  useUpdateTutorialMutation,
  useDeleteTutorialMutation,
} = tutorialApi;
