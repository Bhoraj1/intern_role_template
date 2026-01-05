import { indexSlice } from "../indexSlice";

export const authAPIs = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: `/auth/login`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["auth"],
    }),
    register: builder.mutation({
      query: ({ username, email, password, role }) => ({
        url: `/auth/register`,
        method: "POST",
        body: { username, email, password, role },
      }),
      invalidatesTags: ["users"],
    }),
    verify: builder.query({
      query: () => `/auth/verify`,
      providesTags: ["auth"],
    }),
    getAllUsers: builder.query({
      query: () => '/auth/users',
      providesTags: ['users'],
    }),
    signout: builder.mutation({
      query: () => ({
        url: `/auth/signout`,
        method: "POST",
      }),
      invalidatesTags: ["auth"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyQuery,
  useGetAllUsersQuery,
  useSignoutMutation,
  useDeleteUserMutation,
} = authAPIs;