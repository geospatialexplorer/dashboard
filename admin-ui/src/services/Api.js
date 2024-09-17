// src/services/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Supabase URL and Key
const supabaseUrl = "https://pdtmpyckpklkfikjvpnd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdG1weWNrcGtsa2Zpa2p2cG5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDUwNDQyMywiZXhwIjoyMDQwMDgwNDIzfQ.FZxR7cZefz012P2knSzTaBHHrcSXFhrEcSsZOMxhPGk"; // Replace with your Supabase Key

// Health Data URL
const healthDataURL = "https://sheetdb.io/api/v1/vz5qlws6pgzqj";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${supabaseUrl}/rest/v1/`,
    prepareHeaders: (headers) => {
      headers.set("apikey", supabaseKey);
      headers.set("Authorization", `Bearer ${supabaseKey}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDistrictData: builder.query({
      query: () => "district?select=*",
    }),
    getHealthData: builder.query({
      query: () => ({
        url: `${healthDataURL}`,
        method: "GET",
      }),
    }),
  }),
});

export default apiSlice;
export const { useGetDistrictDataQuery, useGetHealthDataQuery } = apiSlice;
