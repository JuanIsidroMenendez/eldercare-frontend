const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(email, password) {
  const credentials = btoa(`${email}:${password}`);

  // El login entra por httpBasic en /login (postman).
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  const data = await response.json(); // { token: "..." }

  if (!response.ok) {
    throw {
      status: response.status,
      data,
    };
  }

  return data;
}