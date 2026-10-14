import { getToken } from "./authStorage";

export const API_URL = import.meta.env.VITE_API_URL;

export function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function handleResponse(response) {
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    throw { status: response.status, data };
  }
  return data;
}