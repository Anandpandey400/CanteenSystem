import axiosInstance from "../API/axios";

const API = {
  get: <T = any>(url: string, params?: any) =>
    axiosInstance.get<T>(url, { params }),

  post: <T = any>(url: string, body?: any) => {
    const isFormData = body instanceof FormData;

    return axiosInstance.post<T>(url, body, {
      headers: isFormData
        ? undefined // ✅ let browser set multipart boundary
        : { "Content-Type": "application/json" },
    });
  },

  put: <T = any>(url: string, body?: any) => {
    const isFormData = body instanceof FormData;

    return axiosInstance.put<T>(url, body, {
      headers: isFormData
        ? undefined
        : { "Content-Type": "application/json" },
    });
  },

  delete: <T = any>(url: string, params?: any) =>
    axiosInstance.delete<T>(url, { params }),
};

export default API;