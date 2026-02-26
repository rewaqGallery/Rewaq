import { apiRequest } from "./api";

export async function createOrder(orderData) {
  const res = await apiRequest("/order", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
  return res.data;
}

export async function getMyOrders() {
  return await apiRequest("/order");
}

export async function getOrders(filters = {}) {
  const queryParams = new URLSearchParams();
  console.log(filters)
  if (filters.sort) {
    queryParams.append("sort", filters.sort);
  }
  if (filters.keyword) {
    queryParams.append("keyword", filters.keyword);
  }
  if (filters.page) {
    queryParams.append("page", filters.page);
  }
  if (filters.limit) {
    queryParams.append("limit", filters.limit);
  }
  return await apiRequest(`/order?${queryParams.toString()}`);
}

export async function getOrderById(id) {
  return await apiRequest(`/order/${id}`);
}

export async function updateOrderToPaid(id) {
  return await apiRequest(`/order/${id}/pay`, { method: "PATCH" });
}

export async function updateOrderToDelivered(id) {
  return await apiRequest(`/order/${id}/deliver`, { method: "PATCH" });
}

export async function cancelOrder(id) {
  return await apiRequest(`/order/${id}/cancel`, { method: "PATCH" });
}

export async function deleteOrder(id) {
  return await apiRequest(`/order/${id}`, { method: "DELETE" });
}
