import { API_URL, authHeaders, handleResponse } from "../utils/http";

export async function getRooms() {
  const r = await fetch(`${API_URL}/rooms`, { headers: authHeaders() });
  return handleResponse(r);
}

export async function getRoom(id) {
  const r = await fetch(`${API_URL}/rooms/${id}`, { headers: authHeaders() });
  return handleResponse(r);
}

export async function assignResident(roomId, residentId) {
  const r = await fetch(`${API_URL}/rooms/${roomId}/residents/${residentId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handleResponse(r);
}

export async function removeResident(roomId, residentId) {
  const r = await fetch(`${API_URL}/rooms/${roomId}/residents/${residentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(r);
}