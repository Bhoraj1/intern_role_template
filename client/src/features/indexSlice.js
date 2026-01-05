import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const indexSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://test.bnexteventsnepal.com",
    credentials: "include",
  }),
  tagTypes: ["auth", "users"],
  endpoints: () => ({}),
});

export default indexSlice;
