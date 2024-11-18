"use client";

import axios from "axios";

export const BASEURL = process.env.NEXT_PUBLIC_API_URL;

export default function requestApi(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  body: any
) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (body instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  }

  const instance = axios.create({ headers });

  instance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        // config.headers["x-client-id"] = localStorage.getItem("userId");
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalConfig = error.config;
      if (error.response && error.response.status === 419) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("Refresh token not found");
          }
          const result = await instance.post(
            `${BASEURL}auth/refresh`,
            {
              refreshToken: refreshToken,
            },
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
          const {
            accessToken: new_access_token,
            refreshToken: new_refresh_token,
          } = result.data.metadata.token;

          localStorage.setItem("accessToken", new_access_token);
          localStorage.setItem("refreshToken", new_refresh_token);

          originalConfig.headers[
            "Authorization"
          ] = `Bearer ${new_access_token}`;

          return instance(originalConfig);
        } catch (err) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          console.log("err", err);
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance.request({
    method: method,
    url: `${BASEURL}${endpoint}`,
    data: body,
    responseType: "json",
  });
}
