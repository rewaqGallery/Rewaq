import { apiRequest } from "./api";

export const signup = (userData) =>
  apiRequest(`/auth/signup`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const directSignup = (userData) =>
  apiRequest(`/auth/directSignup`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const verifyAccount = (data) =>
  apiRequest(`/auth/verify`, { method: "POST", body: JSON.stringify(data) });

export const login = (credentials) =>
  apiRequest(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const forgetPassword = (data) =>
  apiRequest(`/auth/forgetPassword`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const verifyResetCode = (data) =>
  apiRequest(`/auth/verifyPasswordResetCode`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const resetPassword = (data) =>
  apiRequest(`/auth/resetPassword`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
