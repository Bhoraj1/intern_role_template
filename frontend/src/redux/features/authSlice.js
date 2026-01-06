import { indexSlice } from "./indexSlice";

export const authSlice = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["users"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    verifyToken: builder.query({
      query: () => "/auth/verify",
      providesTags: ["auth"],
    }),
    getAllUsers: builder.query({
      query: () => "/auth/users",
      providesTags: ["users"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/auth/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyTokenQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = authSlice;
