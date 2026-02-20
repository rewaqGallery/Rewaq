import { apiRequest } from "./api";

// Signup
export const signup = (userData) =>
  apiRequest(`/auth/signup`, { method: "POST", body: JSON.stringify(userData) });

// Verify OTP
export const verifyAccount = (data) =>
  apiRequest(`/auth/verify`, { method: "POST", body: JSON.stringify(data) });

// Login
export const login = (credentials) =>
  apiRequest(`/auth/login`, { method: "POST", body: JSON.stringify(credentials) });

// Forget Password - send code
export const forgetPassword = (data) =>
  apiRequest(`/auth/forgetPassword`, { method: "POST", body: JSON.stringify(data) });

// Verify Reset Code
export const verifyResetCode = (data) =>
  apiRequest(`/auth/verifyPasswordResetCode`, { method: "POST", body: JSON.stringify(data) });

// Reset Password (PATCH request)
export const resetPassword = (data) =>
  apiRequest(`/auth/resetPassword`, { method: "PATCH", body: JSON.stringify(data) });
