import { API_URL, authHeaders, handleResponse } from "../utils/http";

// Informes de un residente en concreto.
export async function getResidentReports(residentId) {
  const r = await fetch(`${API_URL}/residents/${residentId}/reports`, { headers: authHeaders() });
  return handleResponse(r);
}

// Crear informe: body (residentId, content ).
export async function createReport(payload) {
  const r = await fetch(`${API_URL}/reports`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(r);
}