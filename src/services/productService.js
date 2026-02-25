import { apiRequest } from "./api";

/**
 * GET /product - Fetch all products.
 * Backend: productRoute GET / — returns e.g. { data: [...] }
 */
// export async function getProducts() {
//   const res = await apiRequest("/product", { method: "GET" });
//   const list = res?.data ?? res;
//   return Array.isArray(list) ? list : [];
// }

/**
 * GET /product/:id - Fetch one product by id.
 * Backend: productRoute GET /:id — returns e.g. { data: {...} }
 */
export async function getProductById(id) {
  const res = await apiRequest(`/product/${id}`, { method: "GET" });
  return res?.data ?? res;
}

export const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  // keyword
  if (filters.keyword) {
    queryParams.append("keyword", filters.keyword);
  }

  // category (id)
  if (filters.categories?.length) {
    queryParams.append("category", filters.categories[0]);
  }

    // sort
  if (filters.sort) {
    queryParams.append("sort", filters.sort);
  }
  // maxPrice
  if (filters.maxPrice > 0) {
    queryParams.append("price[lte]", filters.maxPrice);
  }

  // availableOnly
  if (filters.availableOnly) {
    queryParams.append("quantity[gt]", 0);
  }

  // pagination
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
