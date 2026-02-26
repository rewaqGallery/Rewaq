import { apiRequest } from "./api";

export async function getCategories(filters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.keyword) {
    queryParams.append("keyword", filters.keyword);
  }
  if (filters.sort) {
    queryParams.append("sort", filters.sort);
  }
  if (filters.page) {
    queryParams.append("page", filters.page);
  }
  if (filters.limit) {
    queryParams.append("limit", filters.limit);
  }
  return await apiRequest(`/category?${queryParams.toString()}`);
}

export async function deleteCategory(id) {
  return await apiRequest(`/category/${id}`, { method: "DELETE" });
}

export async function getCategoryById(id) {
  return await apiRequest(`/category/${id}`, { method: "GET" });
}

export async function createCategory(categoryData) {
  return await apiRequest("/category", {
    method: "POST",
    body: categoryData,
  });
}

export async function updateCategory(id, categoryData) {
  return await apiRequest(`/category/${id}`, {
    method: "PATCH",
    body: categoryData,
  });
}
