const API_BASE = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'cc_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

const request = async (path, options = {}) => {
  const { method = 'GET', body, headers = {}, auth = true } = options;

  const config = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };

  if (body !== undefined) config.body = JSON.stringify(body);

  if (auth) {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, config);
  } catch (error) {
    throw new Error('Network error. Is the backend running on port 5000?');
  }

  let data = null;
  let parsedBody = true;
  try {
    data = await response.json();
  } catch (e) {
    parsedBody = false;
  }

  if (!response.ok) {
    if (!parsedBody) {
      if ([502, 503, 504].includes(response.status)) {
        throw new Error(
          'Cannot reach the CampusConnect API. Is the backend running on port 5000? (cd backend && npm run dev)'
        );
      }
      if (response.status >= 500) {
        throw new Error(`Server error (${response.status}). Please try again.`);
      }
    }
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.statusCode = response.status;
    error.data = data;
    if (response.status === 401) setToken(null);
    throw error;
  }

  return data;
};

export const api = {
  get: (path, options) => request(path, { method: 'GET', ...options }),
  post: (path, body, options) => request(path, { method: 'POST', body, ...options }),
  patch: (path, body, options) => request(path, { method: 'PATCH', body, ...options }),
  put: (path, body, options) => request(path, { method: 'PUT', body, ...options }),
  delete: (path, options) => request(path, { method: 'DELETE', ...options }),
};