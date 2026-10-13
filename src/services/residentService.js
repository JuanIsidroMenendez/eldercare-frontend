import { getToken } from "../utils/authStorage";

const API_URL = import.meta.env.VITE_API_URL;

// Cabeceras con el token para las rutas que estén protegidas.
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// Devuelve el JSON o lanza un status o data.
async function handle(response) {
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    throw { status: response.status, data };
  }
  return data;
}

export async function getResidents() {
  const response = await fetch(`${API_URL}/residents`, {
    headers: authHeaders(),
  });
  return handle(response);
}

export async function getResident(id) {
  const response = await fetch(`${API_URL}/residents/${id}`, {
    headers: authHeaders(),
  });
  return handle(response);
}

export async function createResident(payload) {
  const response = await fetch(`${API_URL}/residents`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(response);
}

export async function updateResident(id, payload) {
  const response = await fetch(`${API_URL}/residents/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(response);
}

export async function deleteResident(id) {
  const response = await fetch(`${API_URL}/residents/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handle(response);
}