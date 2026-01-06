import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const indexSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
    credentials: "include",
  }),
  tagTypes: ["auth", "users"],
  endpoints: () => ({}),
});

export default indexSlice;
