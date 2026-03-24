import { apiRequest } from "./api";

export async function getProductById(id) {
  const res = await apiRequest(`/product/${id}`, { method: "GET" });
  return res?.data ?? res;
}

export const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.keyword) {
    queryParams.append("keyword", filters.keyword);
  }

  if (filters.categories?.length) {
    queryParams.append("category", filters.categories[0]);
  }

  if (filters.sort) {
    queryParams.append("sort", filters.sort);
  }

  if (filters.maxPrice > 0) {
    queryParams.append("price[lte]", filters.maxPrice);
  }

  if (filters.availableOnly) {
    queryParams.append("quantity[gt]", 0);
  }

  if (filters.featured) {
    queryParams.append("featured", true);
  }
  queryParams.append("page", filters.page || 1);
  queryParams.append("limit", filters.limit || 10);
 
  const queryString = queryParams.toString();

  return await apiRequest(`/product?${queryString}`);
};

export async function createProduct(productData) {
  return await apiRequest("/product", {
    method: "POST",
    body: productData,
  });
}

export async function deleteProduct(id) {
  return await apiRequest(`/product/${id}`, { method: "DELETE" });
}

export async function updateProduct(id, productData) {
  return await apiRequest(`/product/${id}`, {
    method: "PATCH",
    body: productData,
  });
}
