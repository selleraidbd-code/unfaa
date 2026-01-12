import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/type";

import { Ticket, TicketAdminUpdatePayload, TicketCreatePayload } from "@/types/ticket-type";

const ticketApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createTicket: builder.mutation<void, TicketCreatePayload>({
            query: (payload) => ({
                url: `/tickets`,
                method: METHOD.POST,
                body: payload,
            }),
            invalidatesTags: [TagType.Ticket],
        }),
        getTickets: builder.query<PaginatedResponse<Ticket>, QueryParams>({
            query: (params) => ({
                url: `/tickets`,
                method: METHOD.GET,
                params,
            }),
            providesTags: [TagType.Ticket],
        }),
        getTicketById: builder.query<ResponseObject<Ticket>, { id: string }>({
            query: ({ id }) => ({
                url: `/tickets/${id}`,
                method: METHOD.GET,
            }),
            providesTags: [TagType.Ticket],
        }),
        updateTicket: builder.mutation<void, { id: string; payload: TicketAdminUpdatePayload }>({
            query: ({ id, payload }) => ({
                url: `/tickets/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Ticket],
        }),
        updateTicketByAdmin: builder.mutation<void, { id: string; payload: TicketAdminUpdatePayload }>({
            query: ({ id, payload }) => ({
                url: `/tickets/admin/${id}`,
                method: METHOD.PATCH,
                body: payload,
            }),
            invalidatesTags: [TagType.Ticket],
        }),
        deleteTicket: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/tickets/${id}`,
                method: METHOD.DELETE,
            }),
            invalidatesTags: [TagType.Ticket],
        }),
    }),
});

export const {
    useCreateTicketMutation,
    useGetTicketsQuery,
    useGetTicketByIdQuery,
    useUpdateTicketMutation,
    useDeleteTicketMutation,
    useUpdateTicketByAdminMutation,
} = ticketApi;
