import { apiRequest } from "./api";

export const getCategories = async (query = "") => {
  return await apiRequest(`/category${query}`);
};

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
