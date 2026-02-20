import { apiRequest } from "./api";

export const getMyProfile = () =>
  apiRequest(`/user/myProfile`, { method: "GET" });

export const updateMyProfile = (data) =>
  apiRequest(`/user/updateProfile`, { method: "PATCH", body: data });

export async function getUsers(filters = {}) {
  const params = new URLSearchParams(filters);
  return await apiRequest(`/user?${params.toString()}`);
}

export async function deleteUser(id) {
  return await apiRequest(`/user/${id}`, { method: "DELETE" });
}
