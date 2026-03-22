import { apiRequest } from "./api";

export async function getMyProfile() {
  return await apiRequest(`/user/myProfile`, { method: "GET" });
}

export async function updateMyProfile(data) {
  return await apiRequest(`/user/updateProfile`, {
    method: "PATCH",
    body: data,
  });
}

export async function getUsers(filters = {}) {
  const params = new URLSearchParams();
  if (filters.keyword) {
    params.append("keyword", filters.keyword);
  }
  if (filters.sort) {
    params.append("sort", filters.sort);
  }
  if (filters.page) {
    params.append("page", filters.page);
  }
  if (filters.limit) {
    params.append("limit", filters.limit);
  }
  return await apiRequest(`/user?${params.toString()}`);
}

export async function deleteUser(id) {
  return await apiRequest(`/user/${id}`, { method: "DELETE" });
}
