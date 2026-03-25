// const BASE_URL = "http://localhost:9001";
const BASE_URL = "https://rewaq-server-production.up.railway.app";

export const getToken = () => localStorage.getItem("token");

//! Authenticated request => Adds Authorization header when token exists.
export async function apiRequest(path, options = {}) {
  const token = getToken();
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  let data;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }
if (!res.ok) {
  console.log("Response Status:", res.status);
  console.log("Response Body:", data);

  throw {
    status: res.status,
    data: data,
    message:
      data?.message ||
      (typeof data?.error === "string" ? data.error : null) ||
      `Request failed: ${res.status}`,
  };
}  return data;
}
