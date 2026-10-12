// Gestión del token en el navegador (capa aislada del resto)
const TOKEN_KEY = "token";

// Guarda el token. Si remember = true, persiste entre sesiones (localStorage);
// si no, solo durante la sesión actual (sessionStorage).
export function saveToken(token, remember = false) {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  }
}

// Busca el token en los dos almacenes
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}