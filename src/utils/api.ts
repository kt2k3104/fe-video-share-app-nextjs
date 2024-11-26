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
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        config.headers["Authorization"] = `Bearer ${access_token}`;
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
          const refresh_token = localStorage.getItem("refresh_token");
          if (!refresh_token) {
            throw new Error("Refresh token not found");
          }
          const result = await instance.post(
            `${BASEURL}auth/refresh-token`,
            {
              refresh_token,
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
            access_token: new_access_token,
            refresh_token: new_refresh_token,
          } = result.data.data;

          localStorage.setItem("access_token", new_access_token);
          localStorage.setItem("refresh_token", new_refresh_token);

          originalConfig.headers[
            "Authorization"
          ] = `Bearer ${new_access_token}`;

          return instance(originalConfig);
        } catch (err) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
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
